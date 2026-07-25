import {useState, type FormEvent} from 'react'
import type {Service} from '../types'

type Props = {
    service: Service | null;
    onClose: () => void;
    onSubmit: (details: { date: string; time: string; clientName: string; email: string }) => void
}
const timeSlots = ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM']

export function BookingPanel({service, onClose, onSubmit}: Props) {
    const [time, setTime] = useState(timeSlots[0])
    if (!service) return null
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1)
    const minDate = tomorrow.toISOString().split('T')[0]

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        onSubmit({
            date: String(form.get('date')),
            time,
            clientName: String(form.get('name')),
            email: String(form.get('email'))
        })
    }

    return (
        <div className="booking-backdrop" role="presentation" onMouseDown={onClose}>
            <aside className="booking-panel" role="dialog" aria-modal="true" aria-label="Book an appointment"
                   onMouseDown={(e) => e.stopPropagation()}>
                <button className="close-button" aria-label="Close booking form" onClick={onClose}>×</button>
                <p className="eyebrow">Your appointment</p>
                <h2>Let’s make it official.</h2>
                <div className="booking-service"><span>✦</span>
                    <div><strong>{service.name}</strong><small>{service.duration} min · ${service.price}</small></div>
                </div>
                <form onSubmit={submit}>
                    <label>Date<input required name="date" type="date" min={minDate} defaultValue={minDate}/></label>
                    <fieldset>
                        <legend>Available times</legend>
                        <div className="time-grid">{timeSlots.map((slot) => <button type="button"
                                                                                    className={time === slot ? 'selected' : ''}
                                                                                    onClick={() => setTime(slot)}
                                                                                    key={slot}>{slot}</button>)}</div>
                    </fieldset>
                    <label>Your name<input required name="name" placeholder="Jane Smith"/></label>
                    <label>Email address<input required name="email" type="email" placeholder="jane@email.com"/></label>
                    <button className="primary-button booking-submit" type="submit">Confirm appointment <span>→</span>
                    </button>
                </form>
            </aside>
        </div>
    )
}
