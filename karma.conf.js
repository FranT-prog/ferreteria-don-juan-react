module.exports = function (config) {
  config.set({
    // Definimos el framework de pruebas
    frameworks: ['jasmine'],

    // Le decimos a Karma explícitamente qué plugins cargar
    plugins: [
      require('karma-jasmine'),
      require('karma-webpack'),
      require('karma-chrome-launcher')
    ],

    // Solo buscaremos archivos .jsx para evitar advertencias
    files: [
      'src/**/*.spec.jsx'
    ],

    // Preprocesamos los archivos con webpack antes de probarlos
    preprocessors: {
      'src/**/*.spec.jsx': ['webpack']
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

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  });
};