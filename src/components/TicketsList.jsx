import React from 'react';
import { Trash2, Mail, User, Ticket, DollarSign } from 'lucide-react';
import './TicketsList.css';

export default function TicketsList({ tickets, onDelete, loading }) {
  return (
    <div className="tickets-list">
      {tickets.map((ticket) => (
        <div key={ticket._id} className="ticket-card">
          <div className="ticket-header">
            <h3>{ticket.eventName}</h3>
            <button
              className="delete-btn"
              onClick={() => onDelete(ticket._id)}
              disabled={loading}
              title="Cancel ticket"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="ticket-details">
            <div className="detail-item">
              <User size={16} />
              <div>
                <span className="label">Customer</span>
                <span className="value">{ticket.customerName}</span>
              </div>
            </div>

            <div className="detail-item">
              <Mail size={16} />
              <div>
                <span className="label">Email</span>
                <span className="value">{ticket.customerEmail}</span>
              </div>
            </div>

            <div className="detail-item">
              <Ticket size={16} />
              <div>
                <span className="label">Quantity</span>
                <span className="value">{ticket.quantity} ticket(s)</span>
              </div>
            </div>

            <div className="detail-item">
              <DollarSign size={16} />
              <div>
                <span className="label">Price</span>
                <span className="value">${ticket.price}</span>
              </div>
            </div>
          </div>

          <div className="ticket-footer">
            <div className="total">
              <span>Total:</span>
              <span className="amount">${(ticket.price * ticket.quantity).toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}