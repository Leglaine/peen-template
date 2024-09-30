const router = require("express").Router();
const controller = require("../controllers/users.controller");
const { authenticateToken } = require("../middleware/auth-token");

router.get("/", authenticateToken, controller.getUsers);
router.post("/", controller.createUser);
router.get("/:id", authenticateToken, controller.getUserById);
router.patch("/:id", authenticateToken, controller.updateUser);
router.delete("/:id", authenticateToken, controller.deleteUser);

module.exports = router;
