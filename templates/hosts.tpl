[kafka_broker_hosts]
%{ for ip in jori_test ~}
${ip}
%{ endfor ~}