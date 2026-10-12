module.exports = function (config) {
  config.set({
    // Definimos el framework de pruebas
    frameworks: ['jasmine'],

    // Le decimos a Karma explícitamente qué plugins cargar
    plugins: [
      require('karma-jasmine'),
      require('karma-webpack'),
      require('karma-chrome-launcher'),
      require('karma-coverage') // 👈 Agregado para el informe
    ],

    // Solo buscaremos archivos .jsx para evitar advertencias
    files: [
      'src/**/*.spec.jsx'
    ],

    // Preprocesamos los archivos con webpack y coverage
    preprocessors: {
      'src/**/*.spec.jsx': ['webpack'],
      'src/**/*.jsx': ['coverage'] // 👈 Agregado para medir cobertura
    },

    // Configuración de Webpack para que entienda React (JSX)
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.jsx']
      }
    },

    // 👇 Aquí configuramos los reportes
    reporters: ['progress', 'coverage'], // 'progress' para la terminal, 'coverage' para el HTML

    // 👇 Aquí configuramos cómo se genera el informe de cobertura
        coverageReporter: {
      reporters: [
        { type: 'html', dir: 'coverage/' },
        { type: 'text-summary' } // 👈 Esto hace que aparezca en la terminal
      ]
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  });
};