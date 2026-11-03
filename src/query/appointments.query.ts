export const queryAppointments = `
select
tb_agendado.co_seq_agendado as id_agendamento,
tb_fat_cidadao_pec.co_seq_fat_cidadao_pec as id_paciente, -- identificador do paciente relacionado a query pacientes
tb_agendado.dt_criacao::date as dt_criacao, -- data que foi criada a agenda
tb_agendado.dt_criacao::time as hr_criacao, -- hora que foi criada a agenda
tb_agendado.hr_inicial_agendado::date as data_agenda, -- data para qual dia foi agendado
tb_agendado.hr_inicial_agendado::time as hr_agendado -- hora para qual foi agendado
FROM tb_agendado
left join tb_prontuario on tb_agendado.co_prontuario = tb_prontuario.co_seq_prontuario
left join tb_fat_cidadao_pec on tb_prontuario.co_cidadao = tb_fat_cidadao_pec.co_cidadao
where 
tb_fat_cidadao_pec.co_seq_fat_cidadao_pec is not null
and tb_agendado.dt_criacao is not null
order by
tb_agendado.co_seq_agendado
`;
