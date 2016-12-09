


module.exports = {
   encrypt: function(req, res) {

      var splitId = req.params.id.split(".");
      if (splitId.length > 0) {
         return res.send(splitId[0] + '.alKbY8g923w8kFehWxgO6CiJc5AvUKNf7MZyoB-9dok');
      } else {
         return res.json({
            error: 'an error occured...'
         });
      }

   }
}
