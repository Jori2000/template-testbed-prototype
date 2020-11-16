[cloned machines:]
%{ for ip in jori_test ~}
${ip}
%{ endfor ~}