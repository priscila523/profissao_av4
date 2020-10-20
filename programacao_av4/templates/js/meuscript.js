$(function() { 
    
    function exibir_profissoes() {
        $.ajax({
            url: 'http://localhost:5000/listar_profissoes',
            method: 'GET',
            dataType: 'json', 
            success: listar, 
            error: function(problema) {
                alert("erro ao ler dados, verifique o backend");
            }
        });
         
        function listar (profissoes) {
            $('#corpoTabelaProfissoes').empty();
            mostrar_conteudo("tabelaProfissoes");      
            for (var i in profissoes) { 
                lin = '<tr id="linha_'+profissoes[i].id+'">' + 
                '<td>' + profissoes[i].nome + '</td>' + 
                '<td>' + profissoes[i].funcao + '</td>' + 
                '<td>' + profissoes[i].salario + '</td>' + 
                '<td>' + profissoes[i].detalhe + '</td>' + 
                '<td>' + profissoes[i].caracteristica + '</td>' + 
                '<td><a href=# id="excluir_' + profissoes[i].id + '" ' + 
                  'class="excluir_profissao"><img src="img/excluir.png" '+
                  'alt="Excluir profissão" title="Excluir profissão" height=20 width= 20></a>' + 
                '</td>' + 
                '</tr>';
                $('#corpoTabelaProfissoes').append(lin);
            }
        }
    }

    function mostrar_conteudo(identificador) {
        $("#tabelaProfissoes").addClass('invisible');
        $("#conteudoInicial").addClass('invisible');
        $("#"+identificador).removeClass('invisible');      
    }

    $(document).on("click", "#linkListarProfissoes", function() {
        exibir_profissoes();
    });
    
    $(document).on("click", "#linkInicio", function() {
        mostrar_conteudo("conteudoInicial");
    });

    $(document).on("click", "#btIncluirProfissao", function() {
        nome = $("#campoNome").val();
        funcao = $("#campoFuncao").val();
        salario = $("#campoSalario").val();
        detalhe = $("#campoDetalhe").val();
        caracteristica = $("#campoCaracteristica").val();
        var dados = JSON.stringify({ nome: nome, funcao: funcao, salario: salario, detalhe: detalhe, caracteristica: caracteristica });
        $.ajax({
            url: 'http://localhost:5000/incluir_profissao',
            type: 'POST',
            dataType: 'json', 
            contentType: 'application/json', 
            data: dados, 
            success: profissaoIncluida, 
            error: erroAoIncluir
        });
        function profissaoIncluida (retorno) {
            if (retorno.resultado == "ok") { 
                alert("Profissao incluída com sucesso!");
                $("#campoNome").val("");
                $("#campoFuncao").val("");
                $("#campoSalario").val("");
                $("#campoDetalhe").val("");
                $("#campoCaracteristica").val("");
            } else {
                alert(retorno.resultado + ":" + retorno.detalhes);
            }            
        }
        function erroAoIncluir (retorno) {
            alert("ERRO: "+retorno.resultado + ":" + retorno.detalhes);
        }
    });

    $('#modalIncluirProfissao').on('hide.bs.modal', function (e) {
        if (! $("#tabelaProfissoes").hasClass('invisible')) {
            exibir_profissoes();
        }
    });

    mostrar_conteudo("conteudoInicial");

    $(document).on("click", ".excluir_profissao", function() {
        var componente_clicado = $(this).attr('id'); 
        var nome_icone = "excluir_";
        var id_profissao = componente_clicado.substring(nome_icone.length);
        $.ajax({
            url: 'http://localhost:5000/excluir_profissao/'+id_profissao,
            type: 'DELETE', 
            dataType: 'json', 
            success: profissaoExcluida, 
            error: erroAoExcluir
        });
        function profissaoExcluida (retorno) {
            if (retorno.resultado == "ok") { 
                $("#linha_" + id_profissao).fadeOut(1000, function(){
                    alert("Profissão removida com sucesso!");
                });
            } else {
                alert(retorno.resultado + ":" + retorno.detalhes);
            }            
        }
        function erroAoExcluir (retorno) {
            alert("erro ao excluir dados, verifique o backend: ");
        }
    });
});
