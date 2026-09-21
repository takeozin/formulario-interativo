import React from 'react';
import { ActivityIndicator } from 'react-native';
import { colors } from '../../global/styles/colors';
import { Button, Label } from './styles';

export default function PrimaryButton({ title, onPress, variant = 'primary', loading = false, disabled = false }) {
  const isDisabled = disabled || loading;

  return (
    <Button
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      $variant={variant}
      $disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.primary : colors.onPrimary} />
      ) : (
        <Label $variant={variant}>{title}</Label>
      )}
    </Button>
  );
}
