var uuid = "";
var appid = "";
$(function() {
	try {
		$('.select').on('click', '.placeholder', function(e) {
			var parent = $(this).closest('.select');
			if (!parent.hasClass('is-open')) {
				parent.addClass('is-open');
				$('.select.is-open').not(parent).removeClass('is-open');
			} else {
				parent.removeClass('is-open');
			}
			e.stopPropagation();
		}).on('click', 'ul>li', function() {
			var parent = $(this).closest('.select');
			parent.removeClass('is-open').find('.placeholder').text($(this).text());
		})
		$('body').on('click', function() {
			$('.select.is-open').removeClass('is-open');
		})

	} catch (err) {
		//在此处理错误
	}
	$("body").append('<canvas id="qrcanvas" style="display:none;"></canvas>')
	$("#upteainput").change(function(e) {
		var file = e.target.files[0];
		if (window.FileReader) {
			var fr = new FileReader();
			fr.readAsDataURL(file);
			fr.onloadend = function(e) {
				console.log("文件读取完成")
				var base64Data = e.target.result;
				base64ToqR(base64Data)
			}
		}
	})
	//*******************提交按钮************************
	$("#submit_buy").click(function() {
		var t = $("#sl").val();
		var url = $("#url").val();
		if (t == null || t == "") {
			layer.msg("请输入注册码！");
			return false;
		}
		if (url == null || url == "") {
			layer.msg("识别地址不能为空！");
			return false;
		}
		var ii = layer.load(2, {
			shade: [0.1, '#fff']
		});
		$.ajax({
			type: "POST",
			url: "/up2",
			data: {
				"t": t,
				"url": url,
			},
			dataType: 'json',
			success: function(data) {
				layer.close(ii);
				layer.msg(data.msg);
			},
			error: function(data) {
				layer.close(ii);
				layer.msg('服务器错误');
				return;
			}
		});
	})
	$("#jcrl").click(function() {
		var t = $("#sl").val();
		if (t == null || t == "") {
			layer.msg("请输入注册码！");
			return false;
		}
		var ii = layer.load(2, {
			shade: [0.1, '#fff']
		});
		$.ajax({
			type: "POST",
			url: "/gengxrl2",
			data: {
				"t": t
			},
			dataType: 'json',
			success: function(data) {
				layer.close(ii);
				layer.msg(data.msg);
			},
			error: function(data, error) {
				layer.close(ii);
				layer.msg('服务器错误' + error);
				return false;
			}
		})
	})
	$("#yjsb").click(function() {
		uuid = "";
		var t = $("#sl").val();
		if (t == null || t == "") {
			layer.msg("请输入注册码！");
			return false;
		}
		appid = "";
		if ($('#roleId').text() == "和平精英") {
			appid = 1
		} else if ($('#roleId').text() == "使命召唤手游") {
			appid = 2
		} else if ($('#roleId').text() == "穿越火线-枪战王者") {
			appid = 3
		}
		if (appid == null) {
			layer.msg("请选择登陆到的游戏！");
			return false;
		}
		var ii = layer.load(2, {
			shade: [0.1, '#fff']
		});
		jQuery.ajax({
			type: "GET",
			url: "http://mg.mgxh.cn/authcode",
			data: {
				"t": t,
				"s": appid,
			},
			cache: !1,
			timeout: 6e4,
			dataType: "json",
			success: function(data) {
				uuid = data.uuid,
					msg = data.msg;
				layer.close(ii);
				layer.msg(msg);
				alert(msg);
				if (data.st == 1) {
					setTimeout(a, 2e3);
				}
				console.log(uuid);
				console.log(data.st);
			},
			error: function(data, error) {
				layer.close(ii);
				layer.msg('服务器错误 ' + error);
				console.log(error);
				return false;
			}
		})
	})
	$("#yjsb3").click(function() {
		var t = $("#sl").val();
		if (t == null || t == "") {
			layer.msg("请输入注册码！");
			return false;
		}
		var ii = layer.load(2, {
			shade: [0.1, '#fff']
		});
		$.ajax({
			type: "POST",
			url: "/up2",
			data: {
				"t": t,
				"url": "https://open.weixin.qq.com/connect/confirm?uuid=" + uuid,
			},
			dataType: 'json',
			success: function(data) {
				layer.close(ii);
				layer.msg(data.msg);
			},
			error: function(data) {
				layer.close(ii);
				layer.msg('服务器错误');
				return;
			}
		});
	})
})
function a(c) {
	var ii = layer.load(2, {
		shade: [0.1, '#fff']
	});
	if (uuid == "") {
		layer.close(ii);
		layer.msg("授权码错误");
		return;
	}
	jQuery.ajax({
		type: "GET",
		url: "http://mg.mgxh.cn/qrconnect?uuid=" + uuid + "&s=" + appid,
		dataType: "json",
		cache: !1,
		timeout: 6e4,
		success: function(data) {
			var f = data.wx_errcode,
				g = data.wx_url,
				h = data.wx_code;
			switch (f) {
				case 405:
					layer.close(ii);
					layer.msg("扫码成功");
					window.location = data.wx_url;
					$("#submit_href").show();
					$("#font_href").attr("href", data.wx_url);

					break;
				case 404:
					layer.close(ii);
					layer.msg("等待确认");
					setTimeout(a, 1e3)
					break;
				case 403:
					layer.close(ii);
					layer.msg("扫码超时");
					break;
				case 408:
					setTimeout(a, 2e3)
			}
		},
		error: function(c, d, e) {
			var f = window.wx_errcode;
			408 == f ? setTimeout(a, 5e3) : setTimeout(a, 5e3, f)
		}
	})
}

function base64ToqR(data) {
	var c = document.getElementById("qrcanvas");
	var ctx = c.getContext("2d");
	var img = new Image();
	img.src = data;
	img.onload = function() {
		$("#qrcanvas").attr("width", img.width)
		$("#qrcanvas").attr("height", img.height)
		ctx.drawImage(img, 0, 0, img.width, img.height);
		var imageData = ctx.getImageData(0, 0, img.width, img.height);
		const code = jsQR(imageData.data, imageData.width, imageData.height, {
			inversionAttempts: "dontInvert",
		});
		if (code) {
			console.log("二维码识别结果:" + code.data)
			$("#url").val(code.data)
		} else {
			alert("识别错误")
		}
	};
}
