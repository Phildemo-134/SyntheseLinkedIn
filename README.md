Un générateur de publications LinkedIn à partir d'articles de blog ou de textes

## Stack technique

- React 
- Typescript
- TailindCSS
- Anthropic API (Claude)
- Supabase
- Vercel

## Fonctionnalités

1. Copier le texte à synthétiser dans un input
2. Cliquer sur un bouton pour résumer l'article
3. Envoyer une requête à l'API Anthropic Claude
4. Afficher le résultat dans une section Publications
5. Sauvegarder les publications dans une base de données

## Supabase - Configuration rapide

1) Créez un projet sur Supabase, puis récupérez:
- l'URL du projet
- la clé anonyme (anon key)

2) Ajoutez un fichier `.env.local` à la racine du projet avec:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

3) Créez la table minimale depuis le SQL Editor de Supabase:
```sql
create table if not exists public.saved_posts (
  id uuid primary key default gen_random_uuid(),
  title text null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Activer RLS et autoriser insert/select public (anonyme)
alter table public.saved_posts enable row level security;

create policy "Allow anonymous select" on public.saved_posts
  for select using (true);

create policy "Allow anonymous insert" on public.saved_posts
  for insert with check (true);
```

4) Démarrez l'app en dev:
```
npm run dev
```

L'onglet « Contenu sauvegardé » affiche la liste des publications enregistrées. Depuis l'onglet « Publications », cliquez sur « Sauvegarder » pour ajouter une variante à la base.

