// Função para verificar se a senha atende aos critérios necessários
function isPasswordValid(password) {
  if (password.length < 10 || password.length > 24) {
    return false;
  }

  if (!/[a-z]/.test(password)) {
    return false;
  }

  if (!/[A-Z]/.test(password)) {
    return false;
  }

  if (!/[0-9]/.test(password)) {
    return false;
  }

  if (!/[!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?`~]/.test(password)) {
    return false;
  }

  return true;
}

// Função para calcular a pontuação da senha com base no tamanho
function calculatePasswordStrength(password) {
  var strength = 0;

  if (password.length >= 15 && password.length <= 24) {
    strength += 8;
  }

  if (/[a-z]/.test(password)) {
    strength += 1;
  }

  if (/[A-Z]/.test(password)) {
    strength += 2;
  }

  if (/[0-9]/.test(password)) {
    strength += 1;
  }

  if (/[!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?`~]/.test(password)) {
    strength += 2;
  }

  // Adicionar pontuação com base no tamanho da senha
  var lengthBonus = password.length * 0.5; // Aumento de 0.5 na pontuação para cada caractere da senha
  strength += lengthBonus;

  return strength;
}

// Função para adicionar pontuação ao placar de líderes
function addScoreToLeaderboard(username, score) {
  var leaderboard = getLeaderboard();

  leaderboard.push({
    username: username,
    score: score
  });

  leaderboard.sort(function(a, b) {
    return b.score - a.score;
  });

  if (leaderboard.length > 10) {
    leaderboard.splice(10);
  }

  saveLeaderboard(leaderboard);
}

// Função para obter o placar de líderes
function getLeaderboard() {
  var leaderboardData = localStorage.getItem('leaderboard');

  if (leaderboardData) {
    return JSON.parse(leaderboardData);
  } else {
    return [];
  }
}

// Função para salvar o placar de líderes
function saveLeaderboard(leaderboard) {
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// Função para atualizar o placar de líderes na página HTML
function updateLeaderboard() {
  var leaderboard = getLeaderboard();
  var leaderboardBody = document.getElementById('leaderboard-body');
  leaderboardBody.innerHTML = '';

  for (var i = 0; i < leaderboard.length; i++) {
    var row = document.createElement('tr');
    var usernameCell = document.createElement('td');
    var scoreCell = document.createElement('td');

    usernameCell.textContent = leaderboard[i].username;
    scoreCell.textContent = leaderboard[i].score;

    row.appendChild(usernameCell);
    row.appendChild(scoreCell);

    leaderboardBody.appendChild(row);
  }
}

// Função para resetar o placar de líderes
function resetLeaderboard() {
  if (authenticateAdmin()) {
    localStorage.removeItem('leaderboard');
    updateLeaderboard();
    alert('Placar de líderes resetado com sucesso!');
  } else {
    alert('Senha do administrador incorreta. Não foi possível resetar o placar de líderes.');
  }
}

// Função para autenticar a senha do administrador
function authenticateAdmin() {
  var password = prompt('Digite a senha do administrador:');
  return password === 'binho2005'; // Substitua 'binho2005' pela senha desejada
}

document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  var strengthMessage;
  var score = 0;

  if (isPasswordValid(password)) {
    score = calculatePasswordStrength(password);

    if (score >= 10) {
      strengthMessage = 'Senha Forte';
      document.getElementById('password-strength').className = 'strong';
    } else if (score >= 5) {
      strengthMessage = 'Senha Moderada';
      document.getElementById('password-strength').className = 'weak';
    } else {
      strengthMessage = 'Senha Fraca';
      document.getElementById('password-strength').className = 'weak';
    }
  } else {
    strengthMessage = 'Senha não atende aos critérios necessários';
    document.getElementById('password-strength').className = 'weak';
  }

  document.getElementById('password-strength').textContent = strengthMessage;

  if (score > 0) {
    addScoreToLeaderboard(username, score);
    updateLeaderboard();
  }
});

// Event listener para o botão de reset do placar de líderes
document.getElementById('reset-button').addEventListener('click', function() {
  resetLeaderboard();
});

// Atualizar o placar de líderes ao carregar a página
updateLeaderboard();
