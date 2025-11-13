import { User } from '../types/user';

// Funkcija koja vraća trenutnog korisnika sa podacima iz localStorage ako postoje
export const getCurrentUser = (): User => {
  // Prvo pokušaj učitati iz auth sistema
  const authUser = localStorage.getItem('auth_user');
  const userProfile = localStorage.getItem('user_profile');
  
  let userData = {
    name: 'Amer Hadžić',
    grade: 'IX-2',
    school: 'JU OŠ Hrasnica',
    email: 'amer.hadzic@skola.ba',
  };
  
  // Ako postoji auth user, koristi te podatke
  if (authUser) {
    const parsedAuthUser = JSON.parse(authUser);
    userData.email = parsedAuthUser.email || userData.email;
    
    // Ako ima dodatne podatke u auth_user
    if (parsedAuthUser.name) userData.name = parsedAuthUser.name;
    if (parsedAuthUser.grade) userData.grade = parsedAuthUser.grade;
    if (parsedAuthUser.school) userData.school = parsedAuthUser.school;
  }
  
  // Ako postoji user_profile, koristi te dodatne podatke
  if (userProfile) {
    const parsedProfile = JSON.parse(userProfile);
    if (parsedProfile.name) userData.name = parsedProfile.name;
    if (parsedProfile.grade) userData.grade = parsedProfile.grade;
    if (parsedProfile.school) userData.school = parsedProfile.school;
  }
  
  // Fallback na stare načine čitanja
  const savedName = localStorage.getItem('userName');
  const savedGrade = localStorage.getItem('userGrade');
  const savedSchool = localStorage.getItem('userSchool');
  const savedEmail = localStorage.getItem('userEmail');
  const savedProfileImage = localStorage.getItem('userProfileImage');

  return {
    id: '1',
    name: savedName || userData.name,
    grade: savedGrade || userData.grade,
    school: savedSchool || userData.school,
    email: savedEmail || userData.email,
    profileImage: savedProfileImage || undefined,
    role: 'student',
    points: 180,
    level: 2,
    unlockedAchievements: ['first-step']
  };
};

// Eksportuj trenutnog korisnika
export const currentUser = getCurrentUser();