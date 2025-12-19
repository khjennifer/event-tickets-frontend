import React, { useState } from 'react';
import './BookingForm.css';

export default function BookingForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    eventName: '',
    customerName: '',
    customerEmail: '',
    quantity: 1,
    price: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required';
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }
    if (!formData.quantity || formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    if (!formData.price || formData.price < 0) newErrors.price = 'Price must be valid';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) : name === 'price' ? parseFloat(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(formData);

    // Reset form
    setFormData({
      eventName: '',
      customerName: '',
      customerEmail: '',
      quantity: 1,
      price: ''
    });
    setErrors({});
  };

  const totalPrice = (formData.price || 0) * (formData.quantity || 0);

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="eventName">Event Name <span className="required">*</span></label>
        <input
          type="text"
          id="eventName"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          placeholder="e.g., Concert Night 2024"
          className={errors.eventName ? 'error' : ''}
        />
        {errors.eventName && <span className="error-message">{errors.eventName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="customerName">Your Name <span className="required">*</span></label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          placeholder="John Doe"
          className={errors.customerName ? 'error' : ''}
        />
        {errors.customerName && <span className="error-message">{errors.customerName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="customerEmail">Email Address <span className="required">*</span></label>
        <input
          type="email"
          id="customerEmail"
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleChange}
          placeholder="john@example.com"
          className={errors.customerEmail ? 'error' : ''}
        />
        {errors.customerEmail && <span className="error-message">{errors.customerEmail}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="quantity">Quantity <span className="required">*</span></label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            className={errors.quantity ? 'error' : ''}
          />
          {errors.quantity && <span className="error-message">{errors.quantity}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Price ($) <span className="required">*</span></label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="50.00"
            className={errors.price ? 'error' : ''}
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>
      </div>

      <div className="total-section">
        <div className="total-info">
          <span className="total-label">Total:</span>
          <span className="total-amount">${totalPrice.toFixed(2)}</span>
        </div>
        {totalPrice > 0 && (
          <div className="price-breakdown">
            ${formData.price || '0'} × {formData.quantity || '0'} tickets
          </div>
        )}
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Booking...' : '🎟️ Book Ticket'}
      </button>
    </form>
  );
}