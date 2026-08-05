var entity_id;
var entity_name;
var comm_entries;
var invoice_map = {};
var inst_map = {};
var ins_id;


ZOHO.embeddedApp.on("PageLoad", function(data){
	entity_id = data.EntityId[0];
	console.log(entity_id);
});

ZOHO.embeddedApp.init()
	.then(function(){
	    return ZOHO.CRM.CONFIG.getCurrentUser();
	})
	.then(function(){
	   	return ZOHO.CRM.API.getRecord({Entity:"RFPS", RecordID: entity_id})
	    .then(function(data){
	    	if(data.data != null && data.data.length > 0){
	    		sub_cont_resp = data.data[0];
		    	return sub_cont_resp;
	    	}
	    	
	    })
	})
	.then(function(sub_cont_resp){
		sub_cont_scope = sub_cont_resp.Scope;
		if(sub_cont_scope == "Turf")
		{
			search_code = "111111";
		}
		else if(sub_cont_scope == "Installation")
		{
			search_code = "222222";
		}
		else if(sub_cont_scope == "Poured in Place")
		{
			search_code = "333333";
		}
		query_string = "((Search_Code:equals:" + search_code + ") OR (Search_Code_2:equals:" + search_code + "))";
		ZOHO.CRM.API.searchRecord({Entity: "Sub_Contractors", Type: "criteria", Query: query_string})
		.then(function(subs_resps){
			raw_html = $("#email_summery").html();
			compiled_html = Handlebars.compile(raw_html);
			out_html = compiled_html({subs: subs_resps, entity: entity_id});
			$("#email_data_table").html(out_html);
			// console.log(subs_resps);
		})
	})
;


$(document).ready(function() {
	$(document).on('click', '.sendemail', function(event) {
		subs_id = $(this).data("subs");
		$(this).html("Sent");
		var request = {
			url: "https://crm.zoho.com/crm/v2/functions/send_email_to_sub/actions/execute?auth_type=apikey&zapikey=1003.b358cc534f1f0d212f68ac67f7f15fb7.f0ede0ea26f91f8cf8c0b637e16613c3",
			params: {
				subs_id: subs_id,
				sub_cont_id: entity_id,
			}			
		};
		output = ZOHO.CRM.HTTP.post(request)
		.then(function(data){
			data_output = JSON.parse(data);
		    return data_output.details.output;
		})
	});
});