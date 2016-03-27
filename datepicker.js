var Kylin = {}
Kylin.datapicker = function(){
	var $ = function(id){return document.getElementById(id)},
		getLastDateOfMonth = function(year, month){
			return new Date(new Date(year, month + 1, 1).getTime() - 1000 * 60 * 60 * 24)
		},
		getPos = function (el) {
			for (var pos = {x:0, y:0}; el; el = el.offsetParent) {
				pos.x += el.offsetLeft
				pos.y += el.offsetTop
			}
			return pos
		};
	function init(inputId){
		this.inputId = inputId
		this.table = document.createElement('table')
		this.table.style.cssText = 'position:absolute;display:none'
		this.table.style.left = getPos($(this.inputId)).x + 'px'
		this.table.style.top = getPos($(this.inputId)).y + $(this.inputId).offsetHeight +'px'

		this.createTable(new Date().getFullYear(),new Date().getMonth()+1)
		this.bind()
	}

	init.prototype =  {
		createTable:function(year,month){
			var d = this.d = new Date(year,month-1)
			var lastDay = getLastDateOfMonth(d.getFullYear(),d.getMonth()).getDate()
			var lastMonth = getLastDateOfMonth(d.getFullYear(),d.getMonth()-1).getDate() //上个月最后一天
			var first = new Date(d.getFullYear(),d.getMonth(),1).getDay()
			var last = new Date(d.getFullYear(),d.getMonth(),lastDay).getDay()  //当月最后一天是周几
			last = last === 6 ? -1 : last
			var weekList = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
			var dayList = []
			var prevNum = 0
			var weekHtml = '<tr>'
			weekList.forEach(function(item){
				weekHtml += '<th>' + item + '</th>'
			})
			weekHtml += '</tr>'

			for(var i=0;i<first;i++){
				dayList.unshift(lastMonth)
				lastMonth--
				prevNum++
			}
			for(var i=1;i<=lastDay;i++){
				dayList.push(i)
			}
			for(var i=last,nextMonthDay=1;i<6;i++){
				dayList.push(nextMonthDay)
				nextMonthDay++
			}
			var html='<tr>'
			for(var i=0,l=dayList.length;i<l;i++){
				if(i<prevNum){
					html += '<td class="non">'+ dayList[i] +'</td>'
				}else if(i>l-nextMonthDay){
					html += '<td class="non">'+ dayList[i] +'</td>'	
				}else{
					html += '<td title="valid">'+ dayList[i] +'</td>'	
				}
					
				if((i+1)%7 === 0){
					html += '</tr><tr>'
				}
			}
			html += '</tr>'
			var month = '<td id="leftdirection"></td>'+'<td colspan="5" id="month">'+d.getFullYear() + '-' + (d.getMonth()+1)+'</td>' + '<td id="rightdirection"></td>'
			
			this.table.id = this.inputId + '-' + 'table'
			this.table.innerHTML = ''
			this.table.innerHTML = month + weekHtml + html
			document.getElementsByTagName('body')[0].appendChild(this.table)
		},
		bind:function(){
			var that = this
			$(this.inputId + '-' + 'table').addEventListener('click',function(e){
				var year = that.d.getFullYear()
				var month = that.d.getMonth()
				var target = e.target
				if(target.tagName === 'TD' && target.title ==='valid'){
					$(that.inputId).value = year+ '-' + (month+1)+ '-' +target.innerHTML
					$(that.inputId + '-' + 'table').style.display='none'
				}else if(target.id === 'leftdirection'){
					that.createTable(year,month)
				}else if(target.id === 'rightdirection'){
					that.createTable(year,month+2)
				}
			},false)
			$(this.inputId).addEventListener('click',function(){
				$(that.inputId + '-' + 'table').style.display=''
			},false)
		}
	}

	return init
}();