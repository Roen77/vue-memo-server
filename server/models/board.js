const Sequelize= require('sequelize')

module.exports=class Board extends Sequelize.Model {
    static init(sequelize){
        return super.init({
           title:{
                type:Sequelize.STRING(50),
            },
           description:{
                type:Sequelize.STRING(100),
            },
            bgcolor:{
                type:Sequelize.STRING(50),
            }
        },{
            sequelize,
            charset: 'utf8',
            collate: 'utf8_general_ci',
          })
    }
    static associate(db){
        db.Board.belongsTo(db.User)
        db.Board.hasMany(db.Card)
        
    }
}