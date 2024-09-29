const router = require("express").Router();
const controller = require("../controllers/tokens.controller");

router.post("/", controller.createTokens);
// router.patch("/", controller.updateAccessToken);
// router.delete("/", controller.deleteRefreshToken);

module.exports = router;
