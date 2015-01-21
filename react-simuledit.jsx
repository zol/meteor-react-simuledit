Data = new Mongo.Collection('data');

if (Meteor.isClient) {
  var Editor = React.createClass({
    propTypes: {
      collection: React.PropTypes.instanceOf(Mongo.Collection).isRequired
    },
  
    getInitialState: function() {
      return {text: ''};
    },
  
    componentWillMount: function() {
      this.dep = Tracker.autorun(function() {
        var data = this.props.collection.findOne();
        
        if (data)
          this.setState(data);
      }.bind(this));
    },
    
    componentWillUnmount: function() {
      this.dep.stop();
    },
  
    handleInput: function(event) {
      var text = event.target.value;

      this.setState({text: text}, function() {
        Data.update({_id: this.state._id}, {$set: {text: text}});
      }.bind(this));
    },
  
    render: function() {
      return (
        <div className="editor">
          <h2>Type something</h2>
          <textarea value={this.state.text} onChange={this.handleInput} rows='20' />
        </div>
      );
    }
  });

  Meteor.startup(function() {
    React.render(
      <Editor collection={Data} />,
      document.body
    );
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Data.find().count() === 0)
      Data.insert({text: ''});
  });
}
