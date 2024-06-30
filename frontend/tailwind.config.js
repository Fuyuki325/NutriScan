/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'strong': '0 10px 15px rgba(0, 0, 0, 0.5)', 
      },
      fontFamily: {
      'sans': ['Helvetica', 'Arial', 'sans-serif'],
      'serif': ['Georgia', 'serif'],
      'Lato': ['Lato'],
      },
      colors: {
        'darkblue' : {
        200: '#2E6171', // Lighter shade of your darkblue color
        DEFAULT: '#013C4E', // Default shade of darkblue
        },
        'headerBlue' : '#72F6FD',
        'cyan'  : '#72F6FD',  
        'white': '#ffffff',
        'inputGray': {
          DEFAULT: '#D9D9D9',
          200: '#818589',
        },
        'welcomeGreen': '#01D100',
        'signupGray': '#9F9F9F',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
