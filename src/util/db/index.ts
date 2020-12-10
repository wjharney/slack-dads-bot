import { Model, Sequelize, DataTypes } from 'sequelize'

if (typeof process.env.DATABASE_URL !== 'string') {
  throw new Error('Cannot load database without DATABASE_URL environment variable.')
}

export const sequelize = new Sequelize(process.env.DATABASE_URL)

export const init = async (): Promise<Sequelize> => await sequelize.sync()

export interface ActionAttributes {
  action: string
  team: string
  user: string
  timestamp: Date
}

export class Action extends Model<ActionAttributes> { }

Action.init({
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'action-team-user'
  },
  team: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'action-team-user'
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'action-team-user'
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  timestamps: false
})
