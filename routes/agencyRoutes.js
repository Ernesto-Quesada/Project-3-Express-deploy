const express = require('express');
const router = express.Router();
const ensure = require('connect-ensure-login');
const multer = require('multer');
const path = require('path');


// require the Agency model here
const Agency = require('../models/agencyModel.js');

//requires the User model because there is a query in one 
//route that will use the User model
const User = require('../models/userModel.js');

// ===   Render a list of all Agencys and sends ================
//====   the list with AgencyList variable ================
//====    to the view =====================================
router.get('/agencies', (req, res, next) => {
  //const AgencyList = ["/images/animalseries1.jpg", "/images"]

  Agency.find((err, agencyList) => {
    if (err){
      res.json(err); 
      return; 
    }
        
        //   { agencyList: agencyList});
          console.log('thelist',agencyList);
        // }
        {res.status(200).json(agencyList)}//working ok jul17
       })
    }
 // }
  );
//});

//=== Get  and render  the view for   ================
//======== the form of new Agencys   =====================
router.get('/agency/new', (req, res, next) => {

  res.render('agency/newAgency.ejs', {
      
    });
});


//=== Post the form and save the data   =======
//======== in the data base   =====================
//const myUploader = multer({dest: path.join(__dirname, '../public/images')});
router.post('/agency',
 //ensure.ensureLoggedIn('/login'),
 //myUploader.single('Agency'),
    (req, res, next) => {      
        const nameAgency = req.body.nameAgencyInput;
        const emailAgency = req.body.emailAgencyInput;
        //contactPhone: req.body.yearTaken,
        //author: req.user._id,
        //usersWithThisAgency:req.user._id,
       // address: req.body.description,
        //country: req.body.country
        //imageUrl: `/images/${req.file.filename}`
      console.log('NMAE AGENCY',nameAgency);
      console.log('email AGENCY',emailAgency);

        if (emailAgency === '' || nameAgency === '') {
            res.render('agency/newAgency.ejs', {
                errorMessage: 'Please provide both email and password.'
            });
            return;
        //       {
        //     res.status(400).json({ message: 'Provide username and password.' });
        //     return;
        //   }
            }
    Agency.findOne(
        // 1st arg -> criteria of the findOne (which documents)
      { email: emailAgency },
      // 2nd arg -> projection (which fields)
      { email: 1 },
      // 3rd arg -> callback
      (err, foundAgency) =>{
            if (err) {
                res.status(500).json({ message: 'Something went wrong.' });
                return;
            }
            console.log('found',foundAgency)
            // Don't let the user register if the email is taken
            if (foundAgency) {
            res.render('agency/newAgency.ejs', {
              errorMessage: 'This agency is already in our system '
            });
            return;
            // res.status(400).json({ message: 'The username already exists.' });
            // return;
            }
        // Create the Agency
        const theAgency = new Agency({
          nameAgency: req.body.nameAgencyInput,
          email: req.body.emailAgencyInput,
          //phone: req.body.phoneInput,
          //address:,
        });
         // Save it
        theAgency.save((err) => {
          if (err) {
                res.render('agency/newAgency.ejs', {
                errors:newAgency.errors
                });
            return
            // next(err);
            // return;
            //res.status(500).json({ message: 'Something went wrong.' });
            //return;
          }
        //   req.login(theUser, (err) => {
        //     if (err) {
        //       res.status(500).json({ message: 'Something went wrong.' });
        //       return;
        //     }
            
        //     console.log('???????',req.user._id);
        //     const usertoken = req.user._id
        //     const token = jwt.sign(usertoken, '123');
        //     console.log(token);
        //     //res.json(token)
        //     res.status(200).json([(req.user), (token)]);
        //   });


        // redirect to the list of Agency if it saves
        return res.redirect('/agencies');
        }); 
        // .-------Save-----.
     });
});



//========Details of agency =============
router.get('/agency/:id',(req,res,next) => { 
  // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //   res.status(400)
  //      .json({ message: 'Specified id is not valid' });
  //   return;
  // }
  const agencyId=req.params.id;
  Agency.findById(agencyId,(err,theAgency) => {
    if (err) {
      res.json(err);
      return;
    }
    // res.render('agency/agencyDetails.ejs', {
    //    agency: theAgency 
    // })
    res.status(200).json(theAgency);
  });
});

//==========setting the agency for the client=====
router.post('/agency/:id/select',(req,res,next) => { 
  const agencyId=req.params.id;
  // const userChanges={
  //   agencyInUseId: agencyId
  // };
  User.findByIdAndUpdate( req.user._id , {agencyInUseId: agencyId }, (err,updatedUser) =>{
        if(err){
          next(err);
          return;
        }
        res.status(200).json(updatedUser)
    });
});


router.get('/agency/:id/edit',(req,res,next) => {  //-----------
    const AgencyId = req.params.id;                 //           |
    Agency.findById(AgencyId,(err,theAgency) => {     //           |
      if(err){
        next(err);
        return;
      }


    res.render('Agencys/editAgency.ejs', {
      Agency:theAgency
    });
    }); 
});                                                // .        |
                                                    //         |
router.post('/agency/:id', (req, res, next) => {    //----------
    const agencyId = req.params.id;
        
      const agencyChanges = {
        agencyTitle: req.body.AgencyTitle,
        yearTaken: req.body.yearTaken,
        // author: req.body.author,
        description: req.body.description,
        // imageUrl: req.body.imageUrl,
      };
      Agency.findByIdAndUpdate( agencyId,agencyChanges, (err,theAgency) =>{
        if(err){
          next(err);
          return;
        }
        res.redirect('/Agency');
    });
});

router.get('/agency/',(req,res,next) => { 
  const agencyNa=req.query.name;
  console.log('LOLOLOLO',agencyNa);
  Agency.findOne({nameAgency: agencyNa},(err,theAgency) => {
    if (err) {
      res.json(err);
      return;
    }
    res.status(200).json(theAgency);
  });
});





router.delete('/agency/:id/', 
//ensure.ensureLoggedIn('/login'),
(req, res, next) => {
    const agencyId = req.params.id;
    Agency.findByIdAndRemove(agencyId,(err, theAgency) =>{
      if(err){
        next(err);
        return;
      }
      {res.status(200).json(theAgency)}
    });
});




module.exports = router;
