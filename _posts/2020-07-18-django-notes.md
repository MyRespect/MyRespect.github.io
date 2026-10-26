---
layout: post
title: "Django Notes"
categories: System
tags: Django
--- 

* content
{:toc}

Django, a Python web framework known for its emphasis on swift development, has prompted me to jot down some notes during my Django usage. Additionally, I have taken notes on JQuery.




### **Django Introduction**

Django is an MVC model: (i) M means Model, which defines the database-related content and is placed in the model.py file. (ii) V means View, which defines the front-end related to the static web pages such as HTML; (iii) C means Controller, which defines the processing logic in the view.py file. A Django project can have multiple apps, which can be regarded as sub-systems/sub-modules in a large-scale project. These apps can be independent but could be related.

### **Reset Django migration**

1. Delete all migrations, and then delete the database:
```
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc"  -delete
```

2. Re-generate migrations
```
python manage.py makemigrations
python manage.py migrate
```

### **Django admin**

```
class showAdmin(admin.ModelAdmin):
    list_display = ('userID', 'name', 'taskID', 'status', 'createTime', 'is_sure', 'show_firm_url',)
    search_fields = ('name',)
    list_display_links = ('userID', 'status')

    def show_firm_url(self, obj):
        return format_html("<a href='{url}'>Download</a>", url="/mtasks/download/")
    show_firm_url.short_description = "Results"

    def get_readonly_fields(self, request, obj=None):
        if hasattr(obj, 'is_sure'):
            if obj.is_sure:
                self.readonly_fields = ('is_sure', 'userID', 'name', 'taskID', 'status')
        else:
            self.readonly_fields = ('userID', 'taskID', 'status')
        return self.readonly_fields
 
    def change_view(self, request, object_id, form_url='', extra_context=None):
        change_obj = self.model.objects.filter(pk=object_id)
        self.get_readonly_fields(request, obj=change_obj)
        return super(showAdmin, self).change_view(request, object_id, form_url, extra_context=extra_context)

    def save_model(self, request, obj, form, change):
    def delete_model(self, request, obj):
```

### **Django View**

```
def get_pic(request):
    if request.method == 'POST':
        fileID=request.POST.get("fileID")
        foldPath='results/'+str(fileID)+'/'
        if not os.path.exists(settings.PICTURE_URL+fileID+"snap_x.gif"):
            drawGIF(foldPath+'voxel_0_subset_0.mpv', 'x', fileID)
            drawGIF(foldPath+'voxel_0_subset_0.mpv', 'y', fileID)
            drawGIF(foldPath+'voxel_0_subset_0.mpv', 'z', fileID)
        pic1=fileID+"snap_x.gif";
        pic2=fileID+"snap_y.gif";
        pic3=fileID+"snap_z.gif";
        data=[pic1, pic2, pic3]
        return HttpResponse(json.dumps(data), content_type='application/json')
// In url.py 
urlpatterns += static('mtasks/download/', document_root=settings.PICTURE_ROOT)
```

### **UI in Chinese**

```
SITE_HEADER = os.environ.get('SITE_HEADER', 'Management System') //setting.py
admin.AdminSite.site_header ='Management System'　//admin.py
admin.AdminSite.site_title = 'Management Platform' //admin.py
// models.py
class Meta:
        verbose_name="Task"  //verbose_name can be used for naming table attributes
        verbose_name_plural="Task"
```

### **jQuery**

Js is a front-end script, and we can use ajax (Asynchronous Javascript and XML) to make the back-end server call python script, and then return results to the front end.jQuery is one of the frameworks of javascript, and jQuery uses '$' as the abbreviation of jQuery.
```
$(selector).action() //$ defines jQuery;
$(“#test”).hide() //hide all elements with id=”test”;

// To prevent the running of the jQuery code before the full loading of the document.
$(document).ready(function(){
});
```
* load() means loading data from the server and then returning the data to the selected element;
`$(selector).load(URL, data, callback);`
    * The required URL parameter specifies the URL to be loaded.
    * The optional data parameter specifies the set of the query string (in key-value pairs) sent with the request;
    * The optional callback is the name of the function to be executed after the load() method completes;

* post() method request to load data from the server with HTTP POST `$.post(URL, data, callback);`
`$.post(URL, data, success(data, testStatus, jqXHR), dataType) `
    * The URL is the address that the request is sent;
    * The data can be sent with the request, optional;
    * The success() is the callback function after the data is loaded.
    * dataType() is the expected type of data from the server.

* $.get(url, callback); GET-requesting data from the specified location; POST-sending the data to the specified resources and then requesting data.

* $(selector).each(function(index, element)) Specifing the function to run for each matched element.

### **Others**

* The decorator @route() can bind a function to the corresponding URL; instead of accessing the index page, the user can directly access the desired page.
* Passing parameters with "?" `http://127.0.0.1:8000/plist/?p1=china&p2=2012`
* Show pictures with Django [Reference](https://www.cnblogs.com/zhawj159753/p/3938134.html)
* Monitoring the event:
```
event.target //return the DOM element
event.target.id
event.target.nodeName
event.target.innerHTML //return the content of the DOM
```
* Example
```
<script>
    $(document).ready(function(){
      var ide=document.getElementsByName("myUser");
      for (var i=0; i<ide.length; i++){

          $("#"+ide[i].innerHTML).click(function(event){
          url = "/get_pic/";
          alert("Drawing")
          $.post(url, {"fileID":event.target.id}, success, "json");

          function success(data){
            $('#result_x').html('')
            $('#result_y').html('')
            $('#result_z').html('')

            $('#result_x').append('<img src='+data[0] +' alt="Lights" style="width:100%">');
            $('#result_y').append('<img src='+data[1] +' alt="Lights" style="width:100%">');
            $('#result_z').append('<img src='+data[2] +' alt="Lights" style="width:100%">');
          }
        });
      } 
    });
</script>
```