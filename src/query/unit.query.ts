export const queryUnit = `
SELECT
    tb_dim_equipe.co_seq_dim_equipe as id_equipe,
    tb_dim_municipio.co_seq_dim_municipio as id_municipio, --esse id servirá para definir o municipio no acesso do cliente ao sistema
  	tb_localidade.co_ibge,
    tb_localidade.no_localidade || ' - ' || tb_uf.sg_uf as municipio,
    tb_dim_unidade_saude.co_seq_dim_unidade_saude as id_ubs,
    tb_unidade_saude.nu_cnes,
    UPPER(tb_unidade_saude.no_unidade_saude) as no_unidade,
    tb_equipe.nu_ine, --número da equipe
    tb_equipe.no_equipe,
    tb_tipo_equipe.sg_tipo_equipe as tipo_equipe, -- tipo de equipe cadastrada
    tb_tipo_equipe.nu_ms, -- identificador do ministério da saúde para equipe (portarias)
    tb_tipo_equipe.no_tipo_equipe,
    tb_unidade_saude.nu_telefone_comercial as contato,
    tb_unidade_saude.ds_logradouro as Logradouro,
    tb_unidade_saude.nu_numero as nu_logradouro,
    tb_unidade_saude.no_bairro as bairro,
    tb_unidade_saude.ds_cep as cep
FROM tb_unidade_saude
	LEFT JOIN tb_localidade ON tb_localidade.co_localidade = tb_unidade_saude.co_localidade_endereco
	LEFT JOIN tb_uf ON tb_uf.co_uf = tb_localidade.co_uf
	LEFT JOIN tb_equipe ON tb_unidade_saude.co_seq_unidade_saude = tb_equipe.co_unidade_saude
	LEFT JOIN tb_tipo_equipe ON tb_equipe.tp_equipe = tb_tipo_equipe.co_seq_tipo_equipe
	LEFT JOIN tb_dim_equipe ON tb_equipe.nu_ine = tb_dim_equipe.nu_ine
	LEFT JOIN tb_dim_unidade_saude ON tb_unidade_saude.nu_cnes = tb_dim_unidade_saude.nu_cnes
	LEFT JOIN tb_dim_municipio on tb_localidade.co_ibge = tb_dim_municipio.co_ibge
WHERE
	tb_tipo_equipe.nu_ms IN ('70', '76') -- Tipo equipe eSF e eAP, essas são as equipes reponsáveis por vinculação dos  Agente comunitário de saúde / Técnico em agente comunitário de saúde
  AND tb_equipe.st_ativo = 1 -- Busca apenas as equipes ativas
  AND tb_dim_equipe.co_seq_dim_equipe IS NOT null
`;
