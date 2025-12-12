// src/styles/themeDark.js - Tema Dark (Modo Escuro)

export const colors = {
  primary: '#280a4dff',          // Roxo muito escuro (cor de suco de uva)
  primaryOrange: '#e28f13',    // Laranja fixo para modo claro
  secondary: '#1B5E20',        // Verde escuro
  accent: '#9C27B0',           // Roxo médio para contraste
  background: '#121212',       // Fundo preto suave (Material Dark)
  surface: '#1E1E1E',          // Superfície cinza escuro
  textPrimary: '#E1E1E1',      // Texto claro principal
  textSecondary: '#E1E1E1',    // Texto claro secundário (mudado para claro)
  textLight: '#E1E1E1',        // Texto em fundos escuros (claro)
  textOnPrimary: '#FFFFFF',    // Texto em botões roxos escuros (branco)
  success: '#388E3C',          // Verde médio
  warning: '#F57C00',          // Laranja médio
  error: '#D32F2F',            // Vermelho médio
  info: '#1976D2',             // Azul médio
  border: '#424242',           // Bordas cinza médio
  white: '#FFFFFF',            // Branco puro
  black: '#000000',            // Preto puro
  tabBarInactive: '#757575',   // Cor da tab inativa (mais claro)
  // Cores de alertas para aviso info boxes
  alertBackground: '#332B1F',
  alertBorder: '#8B7355',
  alertText: '#E1E1E1',        // Texto claro
}

export const typography = {
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  body: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  small: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
  },
}

export const layout = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  formContainer: {
    backgroundColor: colors.background,
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    marginVertical: 6,
  },
  input: {
    backgroundColor: colors.surface,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
}
