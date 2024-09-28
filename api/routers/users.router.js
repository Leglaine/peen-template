const router = require("express").Router();
const controller = require("../controllers/users.controller");

router.get("/", controller.getUsers);
router.post("/", controller.createUser);
router.get("/:id", controller.getUserById);
router.patch("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

module.exports = router;
