import React, { useState } from 'react';
import BookingForm from './BookingForm';
import TicketsList from './TicketsList';
import './EventTicketsApp.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function EventTicketsApp() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleBookTicket = async (formData) => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setTickets([...tickets, data]);
        setMessage('✅ Ticket booked successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Error booking ticket. Please try again.');
      console.error('Error:', error);
    }
    
    setLoading(false);
  };

  const handleDeleteTicket = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/tickets/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        setTickets(tickets.filter(ticket => ticket._id !== id));
        setMessage('✅ Ticket cancelled successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Error deleting ticket. Please try again.');
      console.error('Error:', error);
    }
    
    setLoading(false);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎟️ Ticket Booking System</h1>
        <p>Book and manage your event tickets</p>
      </header>

      {message && <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}

      <main className="app-main">
        <div className="booking-section">
          <h2>Book Your Ticket</h2>
          <BookingForm onSubmit={handleBookTicket} loading={loading} />
        </div>

        <div className="tickets-section">
          <h2>Your Bookings ({tickets.length})</h2>
          {tickets.length === 0 ? (
            <p className="empty-state">No tickets booked yet. Book one above!</p>
          ) : (
            <TicketsList tickets={tickets} onDelete={handleDeleteTicket} loading={loading} />
          )}
        </div>
      </main>
    </div>
  );
}