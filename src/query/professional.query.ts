export const queryProfessional = `
SELECT DISTINCT on (tb_dim_profissional.co_seq_dim_profissional)
	tb_dim_equipe.co_seq_dim_equipe as id_equipe,
	tb_dim_profissional.co_seq_dim_profissional AS id_profissional,
	UPPER(tb_dim_profissional.no_profissional) AS no_profissional,
	tb_dim_profissional.nu_cns AS cns,
	tb_cds_prof.nu_cbo_2002,
	tb_lotacao.dt_desativacao_lotacao, --aqui é a data quando o profissional foi desligado da equipe
	tb_unidade_saude.no_unidade_saude,
	COALESCE(tb_dim_profissional.st_registro_valido, 0) AS ativo,
	tb_unidade_saude.nu_cnes
FROM tb_dim_profissional
INNER JOIN tb_cds_prof ON tb_dim_profissional.nu_cns = tb_cds_prof.nu_cns
INNER JOIN tb_prof ON tb_dim_profissional.nu_cns = tb_prof.nu_cns
INNER JOIN tb_lotacao ON tb_prof.co_seq_prof = tb_lotacao.co_prof
INNER JOIN tb_unidade_saude ON  tb_lotacao.co_unidade_saude = tb_unidade_saude.co_seq_unidade_saude
INNER JOIN tb_equipe ON tb_unidade_saude.co_seq_unidade_saude = tb_equipe.co_unidade_saude
INNER JOIN tb_dim_equipe ON tb_equipe.nu_ine = tb_dim_equipe.nu_ine
WHERE
tb_cds_prof.nu_cbo_2002 in ('515105', '322255') AND tb_lotacao.dt_desativacao_lotacao IS NULL
`;
