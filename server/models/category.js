const Sequelize= require('sequelize')

module.exports=class Category extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            type:{
                type:Sequelize.STRING(50),
                allowNull:false,
            },
            icon:{
                type:Sequelize.STRING(500),
                allowNull:false,
            },
            imagetype:{
                type:Sequelize.BOOLEAN,
                defaultValue:false
            }

        },{
            sequelize,
            charset: 'utf8',
            collate: 'utf8_general_ci',
          })
    }
    static associate(db){
        db.Category.belongsToMany(db.Card,{ through: 'CardCategory',as:'Ccategory' })
        db.Category.hasMany(db.Card)
    }
}