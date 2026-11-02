# Mirvai domain and DNS recovery notes

Domain registrar: Namecheap  
Domain: `mirvaigroup.com`  
Current apex: https://mirvaigroup.com  
Current www address: https://www.mirvaigroup.com  
Status at backup time: both active with active SSL certificates.

The records in `dns-records.csv` are the Sites records entered during activation. They document the current setup; do **not** reuse the A/CNAME targets after moving to another hosting provider. The replacement host will provide new routing records.

Namecheap may also display locked, system-managed email-forwarding records. Preserve those records if email forwarding is being used and confirm their exact values in the Namecheap dashboard before any DNS change.

## Safe migration rule

Add and verify the replacement host before removing the current website records. Keep the Namecheap registration renewed. After the replacement site passes testing, update only the records specified by the new host and retain any unrelated email records.
