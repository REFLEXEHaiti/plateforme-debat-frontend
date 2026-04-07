import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const fr = {
  nav: {
    debats: 'Débats', formations: 'Formations', lives: 'Lives',
    tournois: 'Tournois', galerie: 'Galerie', contact: 'Contact',
    tableau_bord: 'Tableau de bord', connexion: 'Connexion',
    inscription: "S'inscrire", deconnexion: 'Déconnexion',
  },
  hero: {
    badge: 'PLATEFORME DE DÉBAT EN HAÏTI',
    titre1: 'Formez-vous à', titre2: "l'art du débat", titre3: 'en Haïti',
    description: 'Participez aux compétitions, développez votre pensée critique et rejoignez la communauté des débatteurs haïtiens.',
    btn_commencer: 'Commencer maintenant', btn_connexion: 'Se connecter', btn_debats: 'Voir les débats',
    stats_debatteurs: 'Débatteurs', stats_formations: 'Formations', stats_tournois: 'Tournois',
    sponsor_partenaire: 'Partenaire', sponsor_devenir: 'Devenir partenaire →',
    today: "Aujourd'hui", debats_actifs: 'débats actifs', en_ligne: 'en ligne',
  },
  commun: {
    chargement: 'Chargement...', annuler: 'Annuler', envoyer: 'Envoyer',
    creer_compte: 'Créer un compte gratuitement', pret_debattre: 'Prêt à débattre ?',
    rejoindre_desc: 'Rejoignez la communauté des débatteurs haïtiens. Gratuit pour commencer.',
  },
};

const kr = {
  nav: {
    debats: 'Débat yo', formations: 'Fòmasyon yo', lives: 'Dirèk',
    tournois: 'Konkou yo', galerie: 'Galri', contact: 'Kontakte',
    tableau_bord: 'Tablo bò', connexion: 'Konekte',
    inscription: 'Enskri', deconnexion: 'Dekonekte',
  },
  hero: {
    badge: 'PLATFÒM DÉBAT AN AYITI',
    titre1: 'Fòme tèt ou nan', titre2: 'atizay débat', titre3: 'nan Ayiti',
    description: 'Patisipe nan konpetisyon yo, devlope panse kritik ou epi rejwenn kominote debatè ayisyen yo.',
    btn_commencer: 'Kòmanse kounye a', btn_connexion: 'Konekte', btn_debats: 'Wè débat yo',
    stats_debatteurs: 'Debatè', stats_formations: 'Fòmasyon', stats_tournois: 'Konkou',
    sponsor_partenaire: 'Patnè', sponsor_devenir: 'Vin patnè →',
    today: 'Jodi a', debats_actifs: 'débat aktif', en_ligne: 'anliy',
  },
  commun: {
    chargement: 'Ap chaje...', annuler: 'Anile', envoyer: 'Voye',
    creer_compte: 'Kreye yon kont gratis', pret_debattre: 'Pare pou débate ?',
    rejoindre_desc: 'Rejwenn kominote debatè ayisyen yo. Gratis pou kòmanse.',
  },
};

const en = {
  nav: {
    debats: 'Debates', formations: 'Courses', lives: 'Live',
    tournois: 'Tournaments', galerie: 'Gallery', contact: 'Contact',
    tableau_bord: 'Dashboard', connexion: 'Login',
    inscription: 'Sign up', deconnexion: 'Logout',
  },
  hero: {
    badge: 'HAITIAN DEBATE PLATFORM',
    titre1: 'Master the', titre2: 'art of debate', titre3: 'in Haiti',
    description: 'Compete, develop critical thinking and join the community of Haitian debaters.',
    btn_commencer: 'Get started', btn_connexion: 'Sign in', btn_debats: 'View debates',
    stats_debatteurs: 'Debaters', stats_formations: 'Courses', stats_tournois: 'Tournaments',
    sponsor_partenaire: 'Partner', sponsor_devenir: 'Become a partner →',
    today: 'Today', debats_actifs: 'active debates', en_ligne: 'online',
  },
  commun: {
    chargement: 'Loading...', annuler: 'Cancel', envoyer: 'Send',
    creer_compte: 'Create a free account', pret_debattre: 'Ready to debate?',
    rejoindre_desc: 'Join the Haitian debaters community. Free to start.',
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        fr: { translation: fr },
        kr: { translation: kr },
        en: { translation: en },
      },
      lng: 'fr',
      fallbackLng: 'fr',
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
}

export default i18n;