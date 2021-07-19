const Sequelize= require('sequelize')

module.exports=class User extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            email:{
                type:Sequelize.STRING(50),
                unique: true,
                allowNull:false,
            },
            password:{
                type:Sequelize.STRING(100),
                allowNull:false,
            },
            nickname:{
                type:Sequelize.STRING(50),
                allowNull:false,
            },


        },{
            sequelize,
            charset: 'utf8',
            collate: 'utf8_general_ci',
          })
    }
    static associate(db){
        db.User.hasMany(db.Board)
        db.User.hasMany(db.Card)
    }
}