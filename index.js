const express    = require("express");
const bodyParser = require("body-parser");
const https      = require("https");
const app        = express();
const mongoose   = require("mongoose");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/dosyalar"));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

const Schema = mongoose.Schema;
mongoose.connect("mongodb+srv://yeni2:1234@cluster1.0o9nc.mongodb.net/Cluster1?retryWrites=true&w=majority", {useNewUrlParser: true , useUnifiedTopology : true});

const guzelSozSema = {
  kategori : String,
  icerik : String
};
const GuzelSoz = mongoose.model("GuzelSoz", guzelSozSema);
/*
var guzelSoz1 = new GuzelSoz({
  kategori : "Kurtlar Vadisi",
  icerik : "Sonunu düşünen kahraman olamaz."
});
var guzelSoz2 = new GuzelSoz({
  kategori : "Kurtlar Vadisi",
  icerik : "Ölüm Ölüm dediğin nedir ki gülüm? ben senin için yaşamayı göze almışım.."
});
var guzelSoz3 = new GuzelSoz({
  kategori : "Kurtlar Vadisi",
  icerik : "Hukuk insanı sadece yaşatmaz, öldürür de."
});
guzelSoz1.save();
guzelSoz2.save();
guzelSoz3.save();
*/
/*
//  TÜM GÜZEL SÖZLERİ JSON FORMATINDA RETURN EDELİM..
app.get("/api/guzelsozler", function(req, res){
  GuzelSoz.find({} , function(err, gelenVeriler){
    res.send(gelenVeriler);
  })
});
//  ID'sine göre JSON FORMATINDA 1 TANE GÜZEL SÖZ RETURN EDELİM.
app.get("/api/guzelsozler/:id", function(req, res){
  var gelenId = req.params.id;
  GuzelSoz.findOne({_id : gelenId} , function(err, gelenVeri){
    res.send(gelenVeri);
  });
});

app.post("/api/guzelsozkayit", function(req, res){
  var kategori = req.body.kategori;
  var icerik   = req.body.icerik;
  var guzelSoz = new GuzelSoz({
    kategori : kategori,
    icerik : icerik
  });
  guzelSoz.save(function(err){
    if(!err)
      res.send("Başarıyla kayıt edildi.");
    else
      res.send(err);
  });
});

app.delete("/api/guzelsozsil/:id", function(req, res){
    GuzelSoz.deleteOne({_id : req.params.id } , function(err){
      if(!err)
        res.send("Başarıyla silindi.")
      else
        res.send(err);
    });
});

app.put("/api/guzelsozdegistirme/:id", function(req, res){
    var kategoriGelen = req.body.kategori;
    var guzelsozGelen = req.body.icerik;
    GuzelSoz.update( {_id : req.params.id}, {kategori : kategoriGelen, icerik : guzelsozGelen}, {overwrite: true}, function(err){
        if(!err)
          res.send("Kayıt başarıyla güncellendi.");
        else
          res.send(err);
    });
});

app.patch("/api/guzelsozguncelleme/:id", function(req, res){
    GuzelSoz.update({ _id : req.params.id } , { $set : req.body } , function(err){
        if(!err)
          res.send("Kayıt başarıyla güncellendi.");
        else
          res.send(err);
    });
});
*/
app.get("/", function(req, res){
  GuzelSoz.find({}, function(err, gelenSozler){
    res.render("anasayfa", {sozler : gelenSozler});
  });
});
app.route("/api/guzelsoz/:id")
    .get(function(req, res){
      GuzelSoz.findOne({_id : req.params.id} , function(err, gelenVeri){
        res.send(gelenVeri);
      });
    })
    .put(function(req, res){
      var kategoriGelen = req.body.kategori;
      var icerikGelen   = req.body.icerik;
      GuzelSoz.update({_id : req.params.id} , {kategori : kategoriGelen, icerik : icerikGelen}, {overwrite: true}, function(err){
        if(!err)
          res.send({sonuc : "Kayıt başarıyla güncellendi."});
        else
          res.send(err);
      });
    })
    .patch(function(req, res){
      GuzelSoz.update({_id : req.params.id} , {$set : req.body}, function(err){
        if(!err)
          res.send({sonuc : "Kayıt başarıyla güncellendi."});
        else
          res.send(err);
      })
    })
    .delete(function(req, res){
      var sifre = req.body.sifre;
      if(sifre == "parola1234"){
        GuzelSoz.deleteOne({_id : req.params.id}, function(err){
          if(!err)
            res.send({sonuc : "Kayıt başarıyla silindi."});
          else
            res.send(err);
        })
      }else{
        res.send({sonuc : "Şifre hatalı."});
      }
    });
app.route("/api/guzelsozler")
    .get(function(req, res){
      GuzelSoz.find({}, function(err, gelenVeri){
        if(!err)
          res.send(gelenVeri);
        else
           res.send(err);
      });
    })
    .post(function(req, res){
       var guzelSoz = new GuzelSoz({
         kategori : req.body.kategori,
         icerik : req.body.icerik
       });
       guzelSoz.save(function(err){
          if(!err)
            res.send( {sonuc : "Kayıt başarıyla oluşturuldu."} );
          else
            res.send(err);
       });
    })
    .delete(function(req, res){
      var sifre = req.body.sifre;
      if(sifre == "parola1234"){
        GuzelSoz.deleteMany({}, function(err){
          if(!err)
            res.send( {sonuc : "Tüm kayıtlar başarıyla silindi."} );
          else
            res.send(err);
        });
      }else{
        res.send({sonuc : "Şifre hatalı."});
      }
    });


    app.get("/admin", function(req, res){
        // 1. Alternatif
        /*GuzelSoz.find({}, function(err, gelenGuzelSozler){
          res.render("admin", {guzelsozler : gelenGuzelSozler});
        })*/
        var link = "https://seyma-guzelsozler.herokuapp.com/api/guzelsozler";
        https.get(link , function(response){
          response.on("data", function(gelenGuzelSozler){
            // gelenGuzelSozler -> byte türünde gelmişti.
            var guzelSozler = JSON.parse(gelenGuzelSozler);
            res.render("admin", {sozler : guzelSozler});
          })
        });
    });

    //https://guzelsozler.herokuapp.com/api/guzelsoz/600c683c986f50001534a062
    app.post("/kayit-sil", function(req, res){
        var id = req.body._id;
        var link = "https://seyma-guzelsozler.herokuapp.com/api/guzelsoz/"+id;
        const gonderilecekler = JSON.stringify({
          sifre: 'parola1234'
        })
        const secenekler = {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
            'Content-Length': gonderilecekler.length
          }
        }
        const baglanti = https.request(link, secenekler, function(response) {
          response.on('data', function(gelenVeri) {
            var sonuc = JSON.parse(gelenVeri);
            res.send(sonuc);
          })
        })
        baglanti.write(gonderilecekler);
        baglanti.end();
    });

    let port = process.env.PORT;
    if(port == "" || port == null){
      port = 5000;
    }
    app.listen(port, function(){
      console.log("port numarasi : " + port);
    });
