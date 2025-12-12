import { View, Text, TextInput, StyleSheet } from 'react-native'
import { useTema } from '../hooks/useTema'

export default function Input({ label, value, onChangeText, keyboardType = 'default', style, fullWidth = true, error, ...props }) {
  const tema = useTema()
  const { colors, typography } = tema
  
  return (
    <View style={[styles.container, !fullWidth && styles.containerCompact, style]}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }, typography.body]}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={[
          styles.input, 
          !fullWidth && styles.inputCompact,
          { 
            backgroundColor: colors.surface, 
            borderColor: error ? colors.error : colors.border,
            color: colors.textPrimary 
          }
        ]}
        placeholder=""
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  containerCompact: {
    maxWidth: 200,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  inputCompact: {
    maxWidth: 200,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
})
