/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xxs': '0.625rem',    // 10px
        'tiny': '0.563rem',   // 9px
      },
      colors: {
        ludibrium: {
          background: {
            light: 'rgb(254, 234, 109)',
            dark: 'rgb(174, 152, 7)',
            red: 'rgba(0, 0, 0, 0.81)',
            border: 'rgb(236, 210, 97)',
            pink: 'rgb(247, 3, 159)',
            brown: 'rgb(227, 145, 63)',
          },
          pillar: {
            primary: 'rgb(126, 157, 6)',
            secondary: 'rgb(78, 153, 7)',
            tertiary: 'rgb(46, 96, 5)',
            quaternary: 'rgb(137, 136, 7)',
            black: 'rgb(9, 33, 1)',
          },
          text: {
            primary: 'rgb(247, 245, 209)',
            secondary: 'rgb(243, 234, 64)',
            white: 'rgb(255, 255, 255)',
          },
          player: {
            1: 'rgb(255, 247, 0)',    // yellow-400
            2: 'rgb(128, 252, 3)',    // cyan-400
            3: 'rgb(34, 211, 238)',    // orange-300
            4: 'rgb(52, 211, 153)',    // emerald-400
          }
        },
        rj: {
          background: {
            light: 'rgb(59, 54, 55)',
            dark: 'rgb(58, 53, 45)',
            border: 'rgb(145, 145, 145)',
          },
        },
        // Room backgrounds and containers
        room: {
          DEFAULT: 'rgba(219, 234, 254, 0.5)', // bg-blue-100/50
          bottom: 'rgba(255, 255, 255, 0.7)', // bg-white/50
          border: 'rgba(191, 219, 254, 1)', // border-blue-200
          floor: 'rgb(82, 82, 82)', // bg-white/50
        },
        // Door Colors
        door: {
          light: {
            DEFAULT: 'rgb(131, 189, 255)',
            bottom: 'rgb(225, 251, 252)', 
            border: 'rgb(196, 196, 196)', 
          },
          dark: {
            DEFAULT: 'rgb(106, 104, 102)', 
            bottom: 'rgba(41, 37, 36, 1)', 
            border: 'rgb(154, 149, 145)',
            hover: 'rgb(229, 229, 229)',
          },
          exit: {
            DEFAULT: 'rgb(52, 140, 223)', 
            hover: 'rgb(115, 180, 245)', 
            active: 'rgb(188, 226, 243)', 
          }
        },
        // Text colors
        text: {
          primary: 'rgba(30, 64, 175, 1)', // text-blue-700
          secondary: 'rgba(75, 85, 99, 1)', // text-gray-600
          light: 'rgba(59, 130, 246, 1)', // text-blue-500
          dark: 'rgba(30, 58, 138, 1)', // text-blue-800
        },
        altText: {
          primary: 'rgba(255, 255, 255, 0.9)', // text-white/90
          secondary: 'rgba(255, 255, 255, 0.6)', // text-white/60
          tertiary: 'rgba(255, 255, 255, 0.4)', // text-white/40
          black: 'rgba(0, 0, 0, 0.9)', // text-black/90
        },
        // Interactive elements
        interactive: {
          DEFAULT: 'rgba(59, 130, 246, 1)', // bg-blue-500
          hover: 'rgba(37, 99, 235, 1)', // hover:bg-blue-600
          active: 'rgba(29, 78, 216, 1)', // active:bg-blue-700
        },
        // Platform colors
        platform: {
          DEFAULT: 'rgba(209, 213, 219, 1)', // bg-gray-300
          hover: 'rgba(156, 163, 175, 1)', // hover:bg-gray-400
          active: 'rgba(107, 114, 128, 1)', // hover:bg-gray-500
        },
        // Status colors
        status: {
          success: 'rgba(34, 197, 94, 1)', // text-green-500
          error: 'rgba(239, 68, 68, 1)', // text-red-500
          hint: 'rgba(245, 158, 11, 1)', // text-yellow-500
          warning: 'rgb(209, 35, 35)', 
        },
        // Decorative elements
        decor: {
          DEFAULT: 'rgba(147, 197, 253, 1)', // bg-blue-300
          light: 'rgba(191, 219, 254, 1)', // bg-blue-200
          dark: 'rgba(96, 165, 250, 1)', // bg-blue-400
        }
      }
    },
  },
  plugins: [],
} 