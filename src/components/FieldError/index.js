import React from 'react';
import { Message } from './styles';

export default function FieldError({ message }) {
  if (!message) {
    return null;
  }
  return (
    <Message accessibilityRole="alert" accessibilityLiveRegion="polite">
      {message}
    </Message>
  );
}
