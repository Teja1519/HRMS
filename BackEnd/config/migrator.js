const { Umzug, SequelizeStorage } = require("umzug");
const { sequelize } = require("./database");
const path = require("path");

const migrator = new Umzug({
  migrations: {
    glob: path.join(__dirname, "../migrations/*.js"),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

const runMigrations = async () => {
  try {
    console.log("🔄 Running pending database migrations...");
    const migrations = await migrator.up();
    console.log(`✅ Applied ${migrations.length} migration(s)`);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    throw error;
  }
};

module.exports = { migrator, runMigrations };
