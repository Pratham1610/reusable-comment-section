import React, { useState } from "react";
import unstarIcon from "../resources/star1.svg";
import starIcon from "../resources/star2.svg";

const Comment = ({ comment, onDelete, onReply, onToggleStar }) => {
    const [reply, setReply] = useState("");

    const handleDelete = () => {
        onDelete(comment.id);
    };

    const handleReply = () => {
        onReply(comment.id, reply);
        setReply("");
    };

    const handleStar = () => {
        onToggleStar(comment.id);
    };

    return (
        <div className="border border-gray-300 rounded-md p-4 mb-4">
            <div className="flex items-center justify-between">
                <div>{comment.text}</div>
                <button className="ml-auto" onClick={handleStar}>
                    {comment.starred ? (
                        <img src={starIcon} alt="Star" className="h-6 w-6" />
                    ) : (
                        <img
                            src={unstarIcon}
                            alt="Unstar"
                            className="h-6 w-6 opacity-50"
                        />
                    )}
                </button>
            </div>
            <div className="mt-2 flex items-center">
                <button className="mr-2 text-blue-500" onClick={handleDelete}>
                    Delete
                </button>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Reply..."
                        className="border border-gray-300 rounded-md p-1 mr-2"
                    />
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-md"
                        onClick={handleReply}
                    >
                        Reply
                    </button>
                </div>
            </div>
            {comment.replies &&
                comment.replies.map((reply) => (
                    <div
                        key={reply.id}
                        className="ml-8 border-l border-gray-300 pl-2 mt-2"
                    >
                        {reply.text}
                    </div>
                ))}
        </div>
    );
};

const CommentSection = () => {
    const [comments, setComments] = useState([]);
    const [input, setInput] = useState("");
    const [sortType, setSortType] = useState("");

    const handlePostComment = () => {
        if (input.trim() !== "") {
            const newComment = {
                id: comments.length + 1,
                text: input,
                starred: false,
                replies: [],
            };
            setComments([...comments, newComment]);
            setInput("");
        }
    };

    const handleDeleteComment = (id) => {
        setComments(comments.filter((comment) => comment.id !== id));
    };

    const handleReplyComment = (id, replyText) => {
        const commentToReply = comments.find((comment) => comment.id === id);
        if (commentToReply && commentToReply.replies.length >= 3) {
            alert("Cannot add reply. Maximum depth reached.");
            return;
        }
        const updatedComments = comments.map((comment) => {
            if (comment.id === id) {
                return {
                    ...comment,
                    replies: [
                        ...comment.replies,
                        { id: comment.replies.length + 1, text: replyText },
                    ],
                };
            }
            return comment;
        });
        setComments(updatedComments);
    };

    const handleToggleStar = (id) => {
        const updatedComments = comments.map((comment) => {
            if (comment.id === id) {
                return {
                    ...comment,
                    starred: !comment.starred,
                };
            }
            return comment;
        });
        setComments(updatedComments);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortType(e.target.value);
    };

    // Sorting function
    const sortedComments = () => {
        if (sortType === "latest") {
            return [...comments].sort((a, b) => b.id - a.id);
        } else if (sortType === "oldest") {
            return [...comments].sort((a, b) => a.id - b.id);
        } else if (sortType === "mostReplies") {
            return [...comments].sort(
                (a, b) => b.replies.length - a.replies.length
            );
        } else if (sortType === "leastReplies") {
            return [...comments].sort(
                (a, b) => a.replies.length - b.replies.length
            );
        } else {
            return comments;
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Write a comment..."
                    className="border border-gray-300 rounded-md p-1 w-full mr-2"
                />
                <button
                    onClick={handlePostComment}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Post
                </button>
            </div>
            <div className="mb-4">
                <label htmlFor="sortSelect" className="mr-2">
                    Sort by:
                </label>
                <select
                    id="sortSelect"
                    value={sortType}
                    onChange={handleSortChange}
                    className="border border-gray-300 rounded-md p-1"
                >
                    <option value="">None</option>
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="mostReplies">Most Replies</option>
                    <option value="leastReplies">Least Replies</option>
                </select>
            </div>

            {sortedComments().map((comment) => (
                <Comment
                    key={comment.id}
                    comment={comment}
                    onDelete={handleDeleteComment}
                    onReply={handleReplyComment}
                    onToggleStar={handleToggleStar}
                />
            ))}
        </div>
    );
};

export default CommentSection;
