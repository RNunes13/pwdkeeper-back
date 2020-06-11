'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('users', 
    [
      {
        name: 'Giovanna Pinto Almeida',
        username: 'Vathe1970',
        email: 'GiovannaPintoAlmeida@teleworm.us',
        password: '25d55ad283aa400af464c76d713c07ad', // 12345678
        disabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Luiz Lima Rocha',
        username: 'Letly1961',
        email: 'LuizLimaRocha@armyspy.com',
        password: '25d55ad283aa400af464c76d713c07ad', // 12345678
        disabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
