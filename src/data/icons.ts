import {
  Heart, Star, Sparkles, Flame, Zap, Sun, Moon, Smile, ThumbsUp, PartyPopper, Award, Trophy, Bookmark,
  MessageCircle, Share2, Send, Mail, Phone, Bell, Hash, AtSign, Globe, Link, Compass,
  Leaf, Flower2, TreePine, Mountain, CloudSun, Droplet, Wind, Feather, Plane, MapPin, Footprints, Camera,
  Palette, Music, Headphones, BookOpen, PenTool, Brush, Scissors, Eye, GraduationCap, Mic, Radio,
  Coffee, Wine, CupSoda, Utensils, Pizza, Apple, Home, Clock, Calendar, Shield, Check,
  ArrowRight, ArrowUpRight, ChevronRight, CornerDownRight, Plus, CheckCircle, Info, Sparkle,
  Target, Key, Gift, Lightbulb, LucideIcon
} from 'lucide-react';

export interface IconItem {
  name: string;
  label: string;
  category: string;
  component: LucideIcon;
}

export const ICON_CATEGORIES = [
  'Tutte',
  'Simboli & Badge',
  'Social & Messaggi',
  'Natura & Viaggi',
  'Arte & Creatività',
  'Vita Quotidiana',
  'Frecce & Puntatori'
] as const;

export const ICON_MAP: Record<string, LucideIcon> = {
  Heart, Star, Sparkles, Flame, Zap, Sun, Moon, Smile, ThumbsUp, PartyPopper, Award, Trophy, Bookmark,
  MessageCircle, Share2, Send, Mail, Phone, Bell, Hash, AtSign, Globe, Link, Compass,
  Leaf, Flower2, TreePine, Mountain, CloudSun, Droplet, Wind, Feather, Plane, MapPin, Footprints, Camera,
  Palette, Music, Headphones, BookOpen, PenTool, Brush, Scissors, Eye, GraduationCap, Mic, Radio,
  Coffee, Wine, CupSoda, Utensils, Pizza, Apple, Home, Clock, Calendar, Shield, Check,
  ArrowRight, ArrowUpRight, ChevronRight, CornerDownRight, Plus, CheckCircle, Info, Sparkle,
  Target, Key, Gift, Lightbulb
};

export const ICON_CATALOG: IconItem[] = [
  // Simboli & Badge
  { name: 'Sparkles', label: 'Luccichio', category: 'Simboli & Badge', component: Sparkles },
  { name: 'Star', label: 'Stella', category: 'Simboli & Badge', component: Star },
  { name: 'Heart', label: 'Cuore', category: 'Simboli & Badge', component: Heart },
  { name: 'Flame', label: 'Fiamma', category: 'Simboli & Badge', component: Flame },
  { name: 'Zap', label: 'Fulmine', category: 'Simboli & Badge', component: Zap },
  { name: 'Award', label: 'Premio', category: 'Simboli & Badge', component: Award },
  { name: 'Trophy', label: 'Trofeo', category: 'Simboli & Badge', component: Trophy },
  { name: 'PartyPopper', label: 'Festa', category: 'Simboli & Badge', component: PartyPopper },
  { name: 'Gift', label: 'Regalo', category: 'Simboli & Badge', component: Gift },
  { name: 'Bookmark', label: 'Segnalibro', category: 'Simboli & Badge', component: Bookmark },
  { name: 'Target', label: 'Obiettivo', category: 'Simboli & Badge', component: Target },
  { name: 'Key', label: 'Chiave', category: 'Simboli & Badge', component: Key },
  { name: 'Shield', label: 'Scudo', category: 'Simboli & Badge', component: Shield },
  { name: 'Lightbulb', label: 'Idea', category: 'Simboli & Badge', component: Lightbulb },

  // Social & Messaggi
  { name: 'MessageCircle', label: 'Commento', category: 'Social & Messaggi', component: MessageCircle },
  { name: 'Share2', label: 'Condividi', category: 'Social & Messaggi', component: Share2 },
  { name: 'Send', label: 'Invia', category: 'Social & Messaggi', component: Send },
  { name: 'ThumbsUp', label: 'Mi Piace', category: 'Social & Messaggi', component: ThumbsUp },
  { name: 'Smile', label: 'Sorriso', category: 'Social & Messaggi', component: Smile },
  { name: 'Bell', label: 'Notifica', category: 'Social & Messaggi', component: Bell },
  { name: 'Hash', label: 'Hashtag', category: 'Social & Messaggi', component: Hash },
  { name: 'AtSign', label: 'Tag Autore', category: 'Social & Messaggi', component: AtSign },
  { name: 'Mail', label: 'Email', category: 'Social & Messaggi', component: Mail },
  { name: 'Phone', label: 'Telefono', category: 'Social & Messaggi', component: Phone },
  { name: 'Globe', label: 'Mondo', category: 'Social & Messaggi', component: Globe },
  { name: 'Link', label: 'Collegamento', category: 'Social & Messaggi', component: Link },

  // Natura & Viaggi
  { name: 'Leaf', label: 'Foglia', category: 'Natura & Viaggi', component: Leaf },
  { name: 'Flower2', label: 'Fiore', category: 'Natura & Viaggi', component: Flower2 },
  { name: 'TreePine', label: 'Albero', category: 'Natura & Viaggi', component: TreePine },
  { name: 'Sun', label: 'Sole', category: 'Natura & Viaggi', component: Sun },
  { name: 'Moon', label: 'Luna', category: 'Natura & Viaggi', component: Moon },
  { name: 'Mountain', label: 'Montagna', category: 'Natura & Viaggi', component: Mountain },
  { name: 'CloudSun', label: 'Meteo', category: 'Natura & Viaggi', component: CloudSun },
  { name: 'Droplet', label: 'Goccia', category: 'Natura & Viaggi', component: Droplet },
  { name: 'Wind', label: 'Vento', category: 'Natura & Viaggi', component: Wind },
  { name: 'Feather', label: 'Piuma', category: 'Natura & Viaggi', component: Feather },
  { name: 'Compass', label: 'Bussola', category: 'Natura & Viaggi', component: Compass },
  { name: 'MapPin', label: 'Posizione', category: 'Natura & Viaggi', component: MapPin },
  { name: 'Plane', label: 'Viaggio', category: 'Natura & Viaggi', component: Plane },
  { name: 'Footprints', label: 'Passi', category: 'Natura & Viaggi', component: Footprints },

  // Arte & Creatività
  { name: 'Palette', label: 'Colori', category: 'Arte & Creatività', component: Palette },
  { name: 'Camera', label: 'Fotocamera', category: 'Arte & Creatività', component: Camera },
  { name: 'Music', label: 'Musica', category: 'Arte & Creatività', component: Music },
  { name: 'Headphones', label: 'Cuffie', category: 'Arte & Creatività', component: Headphones },
  { name: 'Brush', label: 'Pennello', category: 'Arte & Creatività', component: Brush },
  { name: 'PenTool', label: 'Tratto Grafico', category: 'Arte & Creatività', component: PenTool },
  { name: 'Scissors', label: 'Taglia', category: 'Arte & Creatività', component: Scissors },
  { name: 'BookOpen', label: 'Libro', category: 'Arte & Creatività', component: BookOpen },
  { name: 'GraduationCap', label: 'Studio', category: 'Arte & Creatività', component: GraduationCap },
  { name: 'Eye', label: 'Sguardo', category: 'Arte & Creatività', component: Eye },
  { name: 'Mic', label: 'Microfono', category: 'Arte & Creatività', component: Mic },
  { name: 'Radio', label: 'Radio', category: 'Arte & Creatività', component: Radio },

  // Vita Quotidiana
  { name: 'Coffee', label: 'Caffè', category: 'Vita Quotidiana', component: Coffee },
  { name: 'Wine', label: 'Calice', category: 'Vita Quotidiana', component: Wine },
  { name: 'CupSoda', label: 'Bevanda', category: 'Vita Quotidiana', component: CupSoda },
  { name: 'Utensils', label: 'Cibo', category: 'Vita Quotidiana', component: Utensils },
  { name: 'Pizza', label: 'Pizza', category: 'Vita Quotidiana', component: Pizza },
  { name: 'Apple', label: 'Mela / Snack', category: 'Vita Quotidiana', component: Apple },
  { name: 'Home', label: 'Casa', category: 'Vita Quotidiana', component: Home },
  { name: 'Clock', label: 'Ora', category: 'Vita Quotidiana', component: Clock },
  { name: 'Calendar', label: 'Data', category: 'Vita Quotidiana', component: Calendar },
  { name: 'Sparkle', label: 'Punto Luce', category: 'Vita Quotidiana', component: Sparkle },

  // Frecce & Puntatori
  { name: 'ArrowRight', label: 'Freccia Destra', category: 'Frecce & Puntatori', component: ArrowRight },
  { name: 'ArrowUpRight', label: 'Freccia Angolare', category: 'Frecce & Puntatori', component: ArrowUpRight },
  { name: 'ChevronRight', label: 'Scorri / Next', category: 'Frecce & Puntatori', component: ChevronRight },
  { name: 'CornerDownRight', label: 'Punta Qui', category: 'Frecce & Puntatori', component: CornerDownRight },
  { name: 'CheckCircle', label: 'Fatto', category: 'Frecce & Puntatori', component: CheckCircle },
  { name: 'Check', label: 'Spunta', category: 'Frecce & Puntatori', component: Check },
  { name: 'Plus', label: 'Aggiungi', category: 'Frecce & Puntatori', component: Plus },
  { name: 'Info', label: 'Info', category: 'Frecce & Puntatori', component: Info },
];
