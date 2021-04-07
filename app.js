var app = new Vue({
  el: '#app',
  data: function() {
    return { 
    	dialogVisible: false,
    	input: '',
    	postData: []
    }
  },
  methods: {
  	showMessageConnectionSuccess(){
  		this.$message({
        showClose: true,
        message: 'WebSocket connection established.',
        type: 'success'
      });
  	},
  	showMessageConnectionClosed(){
  		this.$message({
        showClose: true,
        message: 'WebSocket connection closed.',
        type: 'warning'
      });
  	},
  	showMessageConnectionError(){
  		this.$message({
        showClose: true,
        message: 'WebSocket error.',
        type: 'error'
      });
  	},
  	postMessage(){
  		if (!ws) {
  			this.showMessageConnectionError();
  			return;
		  }
		  ws.send(this.input);
		  this.pushPostData(this.input);
  	},
  	pushPostData(data){
  		this.postData.push({post: data});
  	}
  }
})

let ws;
if (ws) {
  ws.onerror = ws.onopen = ws.onclose = null;
  ws.close();
}
// init websocket connection
ws = new WebSocket('ws://127.0.0.1:8080');
ws.onerror = function () {
  app.showMessageConnectionError();
};
ws.onopen = function () {
  app.showMessageConnectionSuccess();
};

// when receiving post from server, display it on UI
ws.onmessage = function (event){
	app.pushPostData(event.data);
};
ws.onclose = function () {
  app.showMessageConnectionClosed();
  ws = null;
};