-- HQ Kids - Seed Data
-- NOTA: Execute este seed DEPOIS de criar sua conta de pai via app.
-- Substitua 'YOUR_PARENT_USER_ID' pelo UUID do seu usuário Supabase.

-- Para facilitar o desenvolvimento, este script usa uma função que
-- pode ser chamada após o primeiro login:

create or replace function seed_family(p_parent_id uuid) returns void as $$
declare
  v_otavio_id uuid;
  v_nicolle_id uuid;
  v_angelina_id uuid;
begin
  -- Criar filhos
  insert into children (id, name, theme_color, age, parent_id)
  values
    (uuid_generate_v4(), 'Otávio', '#3B82F6', 11, p_parent_id)
  returning id into v_otavio_id;

  insert into children (id, name, theme_color, age, parent_id)
  values
    (uuid_generate_v4(), 'Nicolle', '#A855F7', 10, p_parent_id)
  returning id into v_nicolle_id;

  insert into children (id, name, theme_color, age, parent_id)
  values
    (uuid_generate_v4(), 'Angelina', '#F472B6', 4, p_parent_id)
  returning id into v_angelina_id;

  -- Criar stats para cada filho
  insert into child_stats (child_id, xp_total, coins_balance, streak_current, streak_max, level)
  values
    (v_otavio_id, 0, 0, 0, 0, 1),
    (v_nicolle_id, 0, 0, 0, 0, 1),
    (v_angelina_id, 0, 0, 0, 0, 1);

  -- Tarefas de exemplo - Casa (para todos)
  insert into tasks (name, icon, type, recurrence, xp_reward, coins_reward, photo_required, llm_criteria, assigned_to, created_by) values
    ('Arrumar a cama', 'bed', 'casa', 'diaria', 10, 5, true, 'A cama deve estar com lençol esticado, travesseiro arrumado e sem roupas em cima', null, p_parent_id),
    ('Escovar os dentes', 'tooth', 'casa', 'diaria', 5, 2, false, null, null, p_parent_id),
    ('Guardar brinquedos', 'puzzle', 'casa', 'diaria', 10, 5, true, 'O quarto deve estar com brinquedos organizados, sem nada espalhado pelo chão', null, p_parent_id);

  -- Tarefas de escola (Otávio e Nicolle)
  insert into tasks (name, icon, type, recurrence, xp_reward, coins_reward, photo_required, llm_criteria, assigned_to, created_by) values
    ('Fazer lição de casa', 'pencil', 'escola', 'diaria', 20, 10, true, 'Caderno aberto com lição feita, escrita legível', v_otavio_id, p_parent_id),
    ('Fazer lição de casa', 'pencil', 'escola', 'diaria', 20, 10, true, 'Caderno aberto com lição feita, escrita legível', v_nicolle_id, p_parent_id),
    ('Ler 15 minutos', 'book-open-variant', 'escola', 'diaria', 15, 8, true, 'Criança com livro aberto, em posição de leitura', v_otavio_id, p_parent_id);

  -- Desafios
  insert into tasks (name, icon, type, recurrence, xp_reward, coins_reward, photo_required, llm_criteria, assigned_to, created_by) values
    ('Ajudar a cozinhar', 'silverware-fork-knife', 'desafio', 'semanal', 30, 15, true, 'Criança participando da preparação de alimentos na cozinha', null, p_parent_id),
    ('Cuidar das plantas', 'flower', 'desafio', 'semanal', 20, 10, true, 'Plantas sendo regadas ou cuidadas', null, p_parent_id);

  -- Tarefas visuais para Angelina
  insert into tasks (name, icon, type, recurrence, xp_reward, coins_reward, photo_required, llm_criteria, assigned_to, created_by) values
    ('Guardar sapatos', 'run', 'casa', 'diaria', 5, 3, true, 'Sapatos organizados no lugar correto', v_angelina_id, p_parent_id),
    ('Dar comida ao pet', 'dog', 'casa', 'diaria', 5, 3, true, 'Pote de comida do pet cheio ou criança alimentando o animal', v_angelina_id, p_parent_id);

  -- Recompensas de exemplo
  insert into rewards (name, icon, cost_coins, available_to, created_by) values
    ('1h de videogame', 'gamepad-variant', 20, null, p_parent_id),
    ('Assistir filme', 'movie-open', 30, null, p_parent_id),
    ('Sorvete', 'ice-cream', 15, null, p_parent_id),
    ('Escolher o jantar', 'pizza', 25, null, p_parent_id),
    ('Dormir mais tarde', 'sleep', 40, v_otavio_id, p_parent_id),
    ('Adesivos novos', 'star-circle', 10, v_angelina_id, p_parent_id);
end;
$$ language plpgsql security definer;

-- Para usar: SELECT seed_family('seu-user-id-aqui');
