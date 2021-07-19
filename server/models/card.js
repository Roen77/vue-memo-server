const Sequelize= require('sequelize')

module.exports=class Card extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            title:{
                type:Sequelize.STRING(50),
                allowNull:false,
            },
            description:{
                type:Sequelize.STRING(100),
                allowNull:false,
            },
            bgcolor:{
                type:Sequelize.STRING(100),
                defaultValue:'#00BCD4'
            },
            complete:{
                type:Sequelize.BOOLEAN,
                defaultValue:false,
                allowNull:false,
            },

        },{
            sequelize,
            charset: 'utf8',
            collate: 'utf8_general_ci',
          })
    }
    static associate(db){
        db.Card.belongsTo(db.User)
        db.Card.belongsToMany(db.Category,{ through: 'CardCategory',as:'CardTypes' })
        db.Card.belongsTo(db.Category)
      
    }
}