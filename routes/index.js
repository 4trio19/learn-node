const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers')
// Do work here
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.post('/add',
    storeController.upload, 
    catchErrors(storeController.resize),
    catchErrors(storeController.createStore)
);
router.post('/add/:id',
    storeController.upload, 
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStore)
);
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

  //below are prev ex uses of res
  // const thing = {
  //   name: "Carmenjello",
  //   age: 100,
  //   cool: true
  // };
  // res.json(thing);
  //res.send();
  //res.body();

//below not used in app.. reverses string after / in URL
router.get('/reverse/:name', (req, res) => {
  const reversed = req.params.name.split("").reverse().join("");
  res.send(reversed);
});

module.exports = router;
