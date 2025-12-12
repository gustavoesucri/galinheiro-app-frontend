import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Switch } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { useTema } from '../hooks/useTema'

export default function SwitchField({ label, value, onValueChange, style, error }) {
  const botoesClaros = useSelector(state => state.botaoModo.botoesClaros)
  const tema = useTema()
  const { colors, typography } = tema
  
  const switchColor = botoesClaros ? tema.colors.primaryOrange : tema.colors.primary

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        {label && <Text style={[styles.label, typography.body, { color: colors.textPrimary }]}>{label}</Text>}
        <Switch
          value={value}
          onValueChange={onValueChange}
          color={switchColor}
          style={styles.switch}
        />
      </View>
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    marginRight: 8,
  },
  switch: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
})
