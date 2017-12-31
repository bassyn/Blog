/*global $ */
(function (){
    'use strict';

    var list = $('#list'),
        title = $('#title'),
        body = $('body'),
        posts,
        index= 0,
        comments = false;

    function showPosts() {
        $(list).empty();
        for (let i = index; i < index + 3; i++){
            $('<li class="posts">' + posts[i].title + '</br>' + posts[i].body + '</li></br>').appendTo(list);
            $('<a id="commentLink">Show Comments</a><hr>')
                    .appendTo(list)
                    .click (function(){
                        if(!comments){
                            $(this).text('Hide Comments');
                            var that = this;
                            $.getJSON('https://jsonplaceholder.typicode.com/comments', {postId: posts[i].id}, function(results) { 
                                results.forEach(function (comment){
                                    //console.log(comment);
                                    $(that).append('<p class="comments">' + comment.name + '</br>' + comment.body + '</p>');
                                });  

                                $('</br><input id="name" placeholder="Name"></br> <input id="body" placeholder="body">' +
                                '</br><button id="button">Submit Comment</button>').appendTo(that);

                                $('p').click(function(e){
                                    e.stopPropagation();
                                });

                                $('input').click(function(e){
                                    e.stopPropagation();
                                });

                                $('#button').click(function(e) {
                                    addComment(posts[i].id);
                                    e.stopPropagation();
                                    $('#name').val('');
                                    $('#body').val('');
                                });

                            });
                            comments = true;
                        }else {
                            $(this).text('Show Comments');
                            comments = false;
                            //$('p').closest(this).hide();
                        }                                     

                    });

            if(index > posts.length-3){
                break;
            }                      
        }
        
        $('<h3 id="previous">Previous</h3>').appendTo(list)
                                            .on('click', function(){
                                                index-=3;
                                                showPosts();
                                            });

        $('<h3 id="next">Next</h3>').appendTo(list)
                                    .on('click', function(){
                                        index+=3;
                                        showPosts();
                                    });

        if(index == 0){
            $('#previous').hide();
            $('#next').css('width', '91%');
        } else {
            $('#next').css('width', '50%');
        }

       if(index == posts.length-1){
            $('#next').hide();
        }

    }

    function addComment(id){
        $.ajax('http://jsonplaceholder.typicode.com/comments', {
            method: 'POST',
            data: {
                title: $('#name').val(),
                body: $('#body').val(),
                postId: id
            }
        }).then(function(data) {
            console.log(data);
        })
    }
         
    $.getJSON('https://jsonplaceholder.typicode.com/users', function(data) {
        data.forEach(function (data){
            $('<li id="blogs">Name: ' + data.name + '</br>' + 'Website: ' + data.website + '</br>' + 
            'Company Name: ' + data.company.name + '<hr></li>')
                .appendTo(list)
                .on('click', function(){
                    title.empty();
                    title.text(data.name + "'s Blog");
                    $.getJSON('https://jsonplaceholder.typicode.com/posts', {userId: data.id}, function(data){
                        list.empty();
     
                            posts = data.map(function (post) {
                                return {
                                    title: post.title,
                                    body: post.body,
                                    id: post.id
                                };  
                            });

                            showPosts();
                    });                   
                });      
        });
    });

    $('#bloglink').on('click', function(){
        location.reload();
    });

}());