Create the Raw data import table in the database tbl_raw_reservation_data
    Use the field names from the XML file <report><billingdetail><detail_collection><detail>
    Please add an ID field
    Please add a created_date field set with a trigger on INSERT
    Please add a modified_date field set with a trigger on INSERT and UPDATE

Create the report import log table in the database tbl_imported_reports
    Use the filed names from the XML file <report><table3><detail_collection><detail>
    Please add an ID field
    Please add a created_date field set with a trigger on INSERT
    Please add a modified_date field set with a trigger on INSERT and UPDATE


Create a process to poll the pop3 account every 15 minutes and check for reports to process.

Determine the report by the To:, From: and Subject: fields.

Read the report and extract the XML data.
Check the report structure is as expected.

Write the XML file to a log folder on the import machine for reference. Please use the E-Mail Subject line and ISO format date as the filename.

Load the required data ( <report><billingdetail><detail_collection><detail> ) into tbl_raw_reservation_data
Load the report details into ( <report><table3><detail_collection><detail> ) into tbl_imported_reports

Write a summary of the XML filename and the number of records imported to syslog.
    Belt and braces I know but easy to remove if not required.

Log any errors to syslog please.

On the database server, please create a process to copy as many fields as you can line up from tbl_raw_reservation_data into the existing table tbl_reservation_data
    Note The field names in tbl_raw_reservation_data reflect Synxis terminology , the field names in tbl_reservation_data reflect Navarino terminology.
         It should be easy to match most of the fields from one to the other. I am after the process here, I can add additional field transformations as I need them.

    Note The Confirm_Number field is not unique in tbl_raw_reservation_data .
             A reservation may be confirmed, then modified, then deleted so there may be multiple records in tbl_raw_reservation_data for the same Confirm_Number.
         The confirmation_number field in tbl_reservation_data should be unique.
             It should contain the latest record from tbl_raw_reservation_data.
