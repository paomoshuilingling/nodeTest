$(function(){
	//操作文章
	$('input[name="addArticle"]').on('click','',function(){
		location.href='/article/add';
	});
	$('input[name="deleteArticle"]').on('click','',function(){
		location.href='/article/delete';
	});
	$('input[name="updateArticle"]').on('click','',function(){
		location.href='/article/update';
	});
	$('input[name="queryArticle"]').on('click','',function(){
		location.href='/article/queryAll';
	});

	//操作作品
	$('input[name="addWork"]').on('click','',function(){
		location.href='/work/add';
	});
	$('input[name="deleteWork"]').on('click','',function(){
		location.href='/work/delete';
	});
	$('input[name="updateWork"]').on('click','',function(){
		location.href='/work/update';
	});
	$('input[name="queryWork"]').on('click','',function(){
		location.href='/work/queryAll';
	});
});