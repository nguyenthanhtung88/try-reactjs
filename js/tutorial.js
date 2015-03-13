var converter = new Showdown.converter();

var data = [
	{author: "Tungshooter", text: "This is first comment"},
	{author: "Ronaldo", text: "This is **another** comment"}
];

var CommentBox = React.createClass({
	loadCommentsFromServer: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, error.toString());
			}.bind(this)
		});
	},
	handleCommentSubmit: function(comment) {
		var comments = this.state.data;
		var newComments = comments.concat([comment]);
		this.setState({data: newComments});

		// TODO: submit to server and refresh list comment
	},
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.loadCommentsFromServer();
		// setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},
	render: function() {		
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.state.data}/>
				<CommentForm onCommentSubmit={this.handleCommentSubmit} />
			</div>
		);
	}
});

var CommentList = React.createClass({
	render: function() {		
		var commentNodes = this.props.data.map(function(comment) {
			return (
				<Comment author={comment.author}>
					{comment.text}
				</Comment>
			);
		});

		return (
			<div className="commentList">
				{commentNodes}
			</div>
		);
	}
});

var CommentForm = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var author = React.findDOMNode(this.refs.author).value.trim();
		var text = React.findDOMNode(this.refs.text).value.trim();
		if (!text || !author) {
			return false;
		}

		// Send request to Server
		this.props.onCommentSubmit({author: author, text: text});
		
		React.findDOMNode(this.refs.author).value = '';
		React.findDOMNode(this.refs.text).value = '';
		return true;
	},
	render: function() {		
		return (
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="Your name" ref="author" />
				<input type="text" placeholder="Say something..." ref="text" />
				<input type="submit" value="Post" />
			</form>
		);
	}
});

var Comment = React.createClass({
	render: function() {
		var rawMarkup = converter.makeHtml(this.props.children.toString());
		return (
			<div className="comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				<span dangerouslySetInnerHTML={{__html: rawMarkup}} />				
			</div>
		);
	}
});

React.render(
	// <CommentBox data={data} />,
	<CommentBox url="data/comments.json" />,
	document.getElementById('content')
);