export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        jal: {
          50: '#effaff', 100: '#def4ff', 500: '#0ea5e9', 600: '#0284c7', 900: '#0c4a6e'
        }
      },
      boxShadow: { soft: '0 18px 45px rgba(2, 132, 199, 0.14)' }
    }
  },
  plugins: []
};
