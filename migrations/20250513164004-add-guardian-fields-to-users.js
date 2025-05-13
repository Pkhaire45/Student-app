await queryInterface.addColumn('users', 'contactNumber', {
  type: Sequelize.STRING(15),
  allowNull: true
});
await queryInterface.addColumn('users', 'dateOfBirth', {
  type: Sequelize.DATEONLY,
  allowNull: true
});
await queryInterface.addColumn('users', 'guardianName', {
  type: Sequelize.STRING(50),
  allowNull: true
});
await queryInterface.addColumn('users', 'guardianContactNumber', {
  type: Sequelize.STRING(15),
  allowNull: true
});
await queryInterface.addColumn('users', 'guardianRelation', {
  type: Sequelize.STRING(30),
  allowNull: true
});
